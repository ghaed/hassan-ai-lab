import { useEffect, useState } from "react";

export default function ModelSwitcher({ selected, onChange }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data) => {
        setModels(data.models || []);
        if (!selected && data.models?.length) onChange(data.models[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <select
      value={selected || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "0.25rem 0.5rem", borderRadius: 4 }}
    >
      {models.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
      {models.length === 0 && <option value="">Loading models…</option>}
    </select>
  );
}
