// import { useCallback, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { GoogleGenAI, Modality } from "@google/genai";
// import {
//   connecting,
//   sessionStarted,
//   tick,
//   screenShareToggled,
//   transcriptAppended,
//   sessionEnded,
//   type TSupportCategory,
// } from "../redux/api/features/support/supportSlice";
// import type { RootState } from "../redux/store";
// import {
//   useEndSupportSessionMutation,
//   useStartSupportSessionMutation,
//   type TSupportLanguage,
// } from "../redux/api/features/support/supportApi";

// const FRAME_INTERVAL_MS = 1000; // 1 fps — enough to read code/errors, cheap on Live API billing
// const FRAME_MAX_WIDTH = 960;

// // Gemini Live audio contract: you send 16-bit PCM mono at 16kHz, it replies
// // with 16-bit PCM mono at 24kHz. Neither matches typical mic hardware rates,
// // so both directions need resampling.
// const INPUT_SAMPLE_RATE = 16000;
// const OUTPUT_SAMPLE_RATE = 24000;

// function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
//   const buffer = new ArrayBuffer(input.length * 2);
//   const view = new DataView(buffer);
//   for (let i = 0; i < input.length; i++) {
//     const s = Math.max(-1, Math.min(1, input[i]));
//     view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
//   }
//   return buffer;
// }

// function downsampleTo16k(buffer: Float32Array, inputRate: number): Float32Array {
//   if (inputRate === INPUT_SAMPLE_RATE) return buffer;
//   const ratio = inputRate / INPUT_SAMPLE_RATE;
//   const outLength = Math.floor(buffer.length / ratio);
//   const result = new Float32Array(outLength);
//   for (let i = 0; i < outLength; i++) {
//     // Average the source samples that fall into this output slot instead of
//     // picking a single one — a cheap low-pass that avoids aliasing speech
//     // into noise, which naive nearest-sample decimation was doing.
//     const start = Math.floor(i * ratio);
//     const end = Math.min(buffer.length, Math.floor((i + 1) * ratio));
//     let sum = 0;
//     for (let j = start; j < end; j++) sum += buffer[j];
//     result[i] = sum / Math.max(1, end - start);
//   }
//   return result;
// }

// function arrayBufferToBase64(buf: ArrayBuffer): string {
//   let binary = "";
//   const bytes = new Uint8Array(buf);
//   for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
//   return btoa(binary);
// }

// function base64ToInt16Array(base64: string): Int16Array {
//   const binary = atob(base64);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
//   return new Int16Array(bytes.buffer);
// }

// export function useSupportSession() {
//   const dispatch = useDispatch();
//   const state = useSelector((s: RootState) => s.support);

//   const [startSupportSession] = useStartSupportSessionMutation();
//   const [endSupportSession] = useEndSupportSessionMutation();

//   // Mutable handles that don't belong in Redux (sockets, media streams, timers).
//   const liveSessionRef = useRef<Awaited<
//     ReturnType<GoogleGenAI["live"]["connect"]>
//   > | null>(null);
//   const micStreamRef = useRef<MediaStream | null>(null);
//   const screenStreamRef = useRef<MediaStream | null>(null);
//   const frameTimerRef = useRef<number | null>(null);
//   const tickTimerRef = useRef<number | null>(null);
//   const endTimerRef = useRef<number | null>(null);

//   // Audio in (mic → PCM16 → Gemini)
//   const inputAudioCtxRef = useRef<AudioContext | null>(null);
//   const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);
//   const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

//   // Audio out (Gemini PCM16 → speakers), queued so chunks don't overlap/garble
//   const outputAudioCtxRef = useRef<AudioContext | null>(null);
//   const nextPlaybackTimeRef = useRef(0);

//   const playAudioChunk = useCallback((base64: string) => {
//     if (!outputAudioCtxRef.current) {
//       outputAudioCtxRef.current = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
//       nextPlaybackTimeRef.current = outputAudioCtxRef.current.currentTime;
//     }
//     const ctx = outputAudioCtxRef.current;
//     if (ctx.state === "suspended") void ctx.resume();
//     const pcm = base64ToInt16Array(base64);

//     const audioBuffer = ctx.createBuffer(1, pcm.length, OUTPUT_SAMPLE_RATE);
//     const channel = audioBuffer.getChannelData(0);
//     for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 0x8000;

//     const source = ctx.createBufferSource();
//     source.buffer = audioBuffer;
//     source.connect(ctx.destination);

//     // Schedule back-to-back so chunks play in order with no gaps/overlaps,
//     // even if they arrive faster or slower than real-time.
//     const startAt = Math.max(nextPlaybackTimeRef.current, ctx.currentTime);
//     source.start(startAt);
//     nextPlaybackTimeRef.current = startAt + audioBuffer.duration;
//   }, []);

//   const stopMicPump = useCallback(() => {
//     inputProcessorRef.current?.disconnect();
//     inputProcessorRef.current = null;
//     inputSourceRef.current?.disconnect();
//     inputSourceRef.current = null;
//     inputAudioCtxRef.current?.close();
//     inputAudioCtxRef.current = null;
//   }, []);

//   const stopScreenShare = useCallback(() => {
//     if (frameTimerRef.current) window.clearInterval(frameTimerRef.current);
//     frameTimerRef.current = null;
//     screenStreamRef.current?.getTracks().forEach((t) => t.stop());
//     screenStreamRef.current = null;
//     dispatch(screenShareToggled(false));
//   }, [dispatch]);

//   const end = useCallback(async () => {
//     liveSessionRef.current?.close();
//     liveSessionRef.current = null;
//     stopMicPump();
//     micStreamRef.current?.getTracks().forEach((t) => t.stop());
//     micStreamRef.current = null;
//     stopScreenShare();
//     outputAudioCtxRef.current?.close();
//     outputAudioCtxRef.current = null;
//     if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
//     if (endTimerRef.current) window.clearTimeout(endTimerRef.current);

//     if (state.sessionId) {
//       try {
//         await endSupportSession({ sessionId: state.sessionId }).unwrap();
//       } catch {
//         // best-effort — the client-side timer already capped the session
//       }
//     }
//     dispatch(sessionEnded());
//   }, [dispatch, state.sessionId, stopScreenShare, stopMicPump, endSupportSession]);

//   const start = useCallback(
//     async (category: TSupportCategory, language: TSupportLanguage) => {
//       dispatch(connecting());

//       // Create (and explicitly resume) the playback context synchronously,
//       // still inside the click's call stack — if this is created later
//       // (e.g. lazily inside the onmessage callback, well after any `await`),
//       // browsers' autoplay policy can leave it permanently 'suspended': no
//       // error is thrown, source.start() just produces no sound. This was
//       // almost certainly why transcript text showed up but audio never did.
//       if (!outputAudioCtxRef.current) {
//         outputAudioCtxRef.current = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
//         nextPlaybackTimeRef.current = outputAudioCtxRef.current.currentTime;
//       }
//       await outputAudioCtxRef.current.resume();

//       const result = await startSupportSession({
//         category,
//         language,
//       }).unwrap();
//       // eslint-disable-next-line no-console
//       console.log("[support] startSupportSession result:", result);
//       const { sessionId, token, model, durationMs } = result;

//       const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
//       micStreamRef.current = mic;
//       const micTrack = mic.getAudioTracks()[0];
//       // eslint-disable-next-line no-console
//       console.log("[support] mic track:", {
//         label: micTrack?.label,
//         enabled: micTrack?.enabled,
//         muted: micTrack?.muted,
//         readyState: micTrack?.readyState,
//       });

//       // Use the real ephemeral token from the backend — never hardcode a key
//       // here. It's single-use and scoped to this one Live session.
//       // Ephemeral tokens are only supported on the v1alpha endpoint — without
//       // this httpOptions override the SDK connects to v1beta, the token is
//       // rejected there, and the socket closes with "1011 Internal error".
//       const ai = new GoogleGenAI({
//         apiKey: token,
//         httpOptions: { apiVersion: "v1alpha" },
//       });

//       const session = await ai.live.connect({
//         model,
//         config: {
//           responseModalities: [Modality.AUDIO],
//           // Without these two, Gemini never sends transcript text back —
//           // this was missing before, so the transcript pane stayed empty.
//           inputAudioTranscription: {},
//           outputAudioTranscription: {},
//         },
//         callbacks: {
//           onmessage: (msg: any) => {
//             // eslint-disable-next-line no-console
//             console.log("[support] raw message:", msg);
//             if (msg.serverContent?.inputTranscription?.text) {
//               dispatch(
//                 transcriptAppended({
//                   role: "user",
//                   text: msg.serverContent.inputTranscription.text,
//                 }),
//               );
//             }
//             if (msg.serverContent?.outputTranscription?.text) {
//               dispatch(
//                 transcriptAppended({
//                   role: "ai",
//                   text: msg.serverContent.outputTranscription.text,
//                 }),
//               );
//             }
//             // eslint-disable-next-line no-console
//             console.log("[support] audio via msg.data:", Boolean(msg.data), {
//               dataLen: msg.data?.length,
//               outputCtxState: outputAudioCtxRef.current?.state,
//             });
//             if (msg.data) playAudioChunk(msg.data);
//           },
//           onclose: (event: any) => {
//             // eslint-disable-next-line no-console
//             console.warn("[support] live session closed:", event?.code, event?.reason);
//             dispatch(sessionEnded());
//           },
//           onerror: (event: any) => {
//             // eslint-disable-next-line no-console
//             console.error("[support] live session error:", event);
//             dispatch(sessionEnded());
//           },
//         },
//       });
//       liveSessionRef.current = session;
//       // eslint-disable-next-line no-console
//       console.log("[support] live session connected", { model, hasToken: Boolean(token) });

//       // Mic → PCM16 → session.sendRealtimeInput(). ScriptProcessorNode is
//       // deprecated but simplest for a single self-contained file; swap for an
//       // AudioWorklet later if you want it off the main thread.
//       // NOTE: Do NOT pass { sampleRate: INPUT_SAMPLE_RATE } here — Chromium has
//       // a known bug where an AudioContext created with a custom sampleRate
//       // silently produces all-zero data from a MediaStreamAudioSourceNode.
//       // That's exactly what the RMS-logging just proved (constant 0.0000).
//       // Use the device's native rate and downsample manually instead.
//       const inputCtx = new AudioContext();
//       inputAudioCtxRef.current = inputCtx;
//       const source = inputCtx.createMediaStreamSource(mic);
//       inputSourceRef.current = source;
//       const processor = inputCtx.createScriptProcessor(4096, 1, 1);
//       inputProcessorRef.current = processor;

//       let loggedFirstChunk = false;
//       let chunkCount = 0;
//       processor.onaudioprocess = (e) => {
//         const raw = e.inputBuffer.getChannelData(0);
//         const downsampled = downsampleTo16k(raw, inputCtx.sampleRate);
//         const pcm = floatTo16BitPCM(downsampled);
//         chunkCount += 1;
//         try {
//           liveSessionRef.current?.sendRealtimeInput({
//             audio: { data: arrayBufferToBase64(pcm), mimeType: "audio/pcm;rate=16000" },
//           });
//           if (!loggedFirstChunk) {
//             loggedFirstChunk = true;
//             // eslint-disable-next-line no-console
//             console.log("[support] first mic chunk sent, bytes:", pcm.byteLength);
//           }
//           if (chunkCount % 10 === 0) {
//             let sumSquares = 0;
//             for (let i = 0; i < downsampled.length; i++) sumSquares += downsampled[i] * downsampled[i];
//             const rms = Math.sqrt(sumSquares / downsampled.length);
//             // eslint-disable-next-line no-console
//             console.log("[support] chunk", chunkCount, "rms:", rms.toFixed(4), rms < 0.005 ? "(near-silent!)" : "");
//           }
//         } catch (err) {
//           // eslint-disable-next-line no-console
//           console.error("[support] sendRealtimeInput failed:", err);
//         }
//       };
//       source.connect(processor);
//       processor.connect(inputCtx.destination);

//       dispatch(sessionStarted({ sessionId, category, language, durationMs }));

//       tickTimerRef.current = window.setInterval(() => dispatch(tick()), 1000);
//       endTimerRef.current = window.setTimeout(() => end(), durationMs);
//     },
//     [dispatch, end, startSupportSession, playAudioChunk],
//   );

//   const shareScreen = useCallback(async () => {
//     const screenStream = await navigator.mediaDevices.getDisplayMedia({
//       video: true,
//     });
//     screenStreamRef.current = screenStream;
//     dispatch(screenShareToggled(true));

//     const video = document.createElement("video");
//     video.srcObject = screenStream;
//     await video.play();
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d")!;

//     frameTimerRef.current = window.setInterval(() => {
//       const scale = Math.min(1, FRAME_MAX_WIDTH / video.videoWidth);
//       canvas.width = video.videoWidth * scale;
//       canvas.height = video.videoHeight * scale;
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const base64 = canvas.toDataURL("image/jpeg", 0.6).split(",")[1];
//       liveSessionRef.current?.sendRealtimeInput({
//         video: { data: base64, mimeType: "image/jpeg" },
//       });
//     }, FRAME_INTERVAL_MS);

//     screenStream.getVideoTracks()[0].addEventListener("ended", stopScreenShare);
//   }, [dispatch, stopScreenShare]);

//   // Clean up on unmount so a route change doesn't leave the mic/screen live.
//   useEffect(() => {
//     return () => {
//       if (liveSessionRef.current || micStreamRef.current) void end();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return { ...state, start, end, shareScreen, stopScreenShare };
// }