import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TSupportCategory = "coding" | "mental" | "guidance" | "general";
export type TSupportLanguage = "EN" | "BN";
export type TranscriptEntry = { role: "user" | "ai"; text: string };

interface SupportState {
  sessionId: string | null;
  category: TSupportCategory | null;
  language: TSupportLanguage;
  status: "idle" | "connecting" | "active" | "ended";
  screenSharing: boolean;
  secondsLeft: number;
  transcript: TranscriptEntry[];
}

const initialState: SupportState = {
  sessionId: null,
  category: null,
  language: "EN",
  status: "idle",
  screenSharing: false,
  secondsLeft: 600,
  transcript: [],
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    connecting(state) {
      state.status = "connecting";
    },
    sessionStarted(
      state,
      action: PayloadAction<{
        sessionId: string;
        category: TSupportCategory;
        language: TSupportLanguage;
        durationMs: number;
      }>,
    ) {
      state.sessionId = action.payload.sessionId;
      state.category = action.payload.category;
      state.language = action.payload.language;
      state.status = "active";
      state.secondsLeft = Math.floor(action.payload.durationMs / 1000);
      state.transcript = [];
    },
    tick(state) {
      if (state.secondsLeft > 0) state.secondsLeft -= 1;
    },
    screenShareToggled(state, action: PayloadAction<boolean>) {
      state.screenSharing = action.payload;
    },
    transcriptAppended(state, action: PayloadAction<TranscriptEntry>) {
      state.transcript.push(action.payload);
    },
    sessionEnded(state) {
      state.status = "ended";
      state.screenSharing = false;
    },
    reset() {
      return initialState;
    },
  },
});

export const {
  connecting,
  sessionStarted,
  tick,
  screenShareToggled,
  transcriptAppended,
  sessionEnded,
  reset,
} = supportSlice.actions;

export default supportSlice.reducer;
