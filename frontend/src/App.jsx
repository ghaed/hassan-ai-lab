import { useState } from "react";
import Chat from "./components/Chat";
import ModelSwitcher from "./components/ModelSwitcher";

export default function App() {
  const [model, setModel] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif" }}>
      <header style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.1rem" }}>Hassan AI Lab</h1>
        <ModelSwitcher selected={model} onChange={setModel} />
      </header>
      <Chat model={model} />
    </div>
  );
}
