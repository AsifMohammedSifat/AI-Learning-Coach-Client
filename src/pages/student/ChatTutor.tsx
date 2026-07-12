import { useEffect, useRef, useState } from "react";
import { Input, Button, Segmented, Skeleton } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { toast } from "sonner";

import "./Student.css";
import {
  useGetChatHistoryQuery,
  useSendChatMessageMutation,
} from "../../redux/api/features/chat/chatApi";
import type { TLanguage, TMessage } from "../../type";

const suggestions = [
  "Binary search vs linear search?",
  "What's the difference between set and map?",
  "Give me a practice problem for this week",
];

export default function ChatTutor() {
  const { data: historyData, isLoading: loadingHistory } =
    useGetChatHistoryQuery(undefined);
  const [sendMessage, { isLoading: sending }] = useSendChatMessageMutation();
  const [language, setLanguage] = useState<TLanguage>("বাংলা");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TMessage[]>([]);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (historyData?.data) setMessages(historyData.data);
  }, [historyData]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, sending]);


  // go to page lower side
useEffect(() => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}, []);

  const handleSend = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;

    type TMessage = {
      id: string;
      role: "user" | "assistant";
      text: string;
    };
    const userMsg: TMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      text: value,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await sendMessage({ message: value, language }).unwrap();
      setMessages((prev) => [...prev, res.data]);
    } catch {
      toast.error("Couldn't reach the tutor — try again");
    }
  };

  return (
    <div style={{marginTop: "30px"}}>
      <div className="eyebrow">Chat tutor</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        Ask anything about your current topic
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Context-aware answers, with code examples when useful.
      </p>

      <div className="chat-shell">
        <div className="chat-topline">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "var(--mint-dim)",
                color: "var(--mint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
              }}
            >
              AI
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                Learning Coach Tutor
              </div>
              <div
                style={{ fontSize: 10.5, color: "var(--mint)" }}
                className="mono"
              >
                ● online
              </div>
            </div>
          </div>
          <Segmented
            options={["বাংলা", "EN"]}
            value={language}
            onChange={setLanguage}
          />
        </div>

        <div className="chat-body" ref={bodyRef}>
          {loadingHistory ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : messages.length === 0 ? (
            <div className="msg bot">
              <div className="msg-bubble">
                হাই! আমি তোমার AI টিউটর 👋 কোনো প্রশ্ন থাকলে জিজ্ঞেস করো।
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                className={`msg ${m.role === "user" ? "user" : "bot"}`}
                key={m.id}
              >
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))
          )}
          {sending && (
            <div className="msg bot">
              <div className="msg-bubble" style={{ padding: "4px 8px" }}>
                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="suggest-row">
          {suggestions.map((s) => (
            <div className="suggest-chip" key={s} onClick={() => handleSend(s)}>
              {s}
            </div>
          ))}
        </div>

        <div className="chat-input-row">
          <Input
            size="large"
            placeholder="তোমার প্রশ্ন লেখো…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={() => handleSend()}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            loading={sending}
          />
        </div>
      </div>
    </div>
  );
}
