import { useRef, useState } from "react";
import MessageList from "./MessageList";

export default function Chat({ model }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    const userMsg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    const assistantMsg = { role: "assistant", content: "" };
    setMessages([...nextMessages, assistantMsg]);
    setStreaming(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: nextMessages }),
      });

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") break;
          const { delta } = JSON.parse(payload);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + delta,
            };
            return updated;
          });
        }
      }
    } finally {
      setStreaming(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <MessageList messages={messages} streaming={streaming} />
      <div ref={bottomRef} />
      <div style={{ display: "flex", gap: "0.5rem", padding: "0.75rem 1rem", borderTop: "1px solid #ddd" }}>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          style={{ flex: 1, resize: "none", padding: "0.5rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "0.95rem" }}
        />
        <button
          onClick={send}
          disabled={streaming || !input.trim()}
          style={{ padding: "0 1.25rem", borderRadius: 6, background: "#0070f3", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
