export default function MessageList({ messages, streaming }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            background: msg.role === "user" ? "#0070f3" : "#f0f0f0",
            color: msg.role === "user" ? "#fff" : "#000",
            padding: "0.5rem 0.875rem",
            borderRadius: 12,
            maxWidth: "75%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {msg.content}
          {streaming && i === messages.length - 1 && msg.role === "assistant" && (
            <span style={{ display: "inline-block", width: 8, height: "1em", background: "currentColor", marginLeft: 2, animation: "blink 1s step-start infinite" }} />
          )}
        </div>
      ))}
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}
