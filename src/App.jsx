import { useState } from "react";
import ColorCircleFinal from "./ColorCircleFinal";
import AgeCalculator from "./AgeCalculator";

const TABS = [
  { id: "color", label: "Task 1: Colour Circle", view: <ColorCircleFinal /> },
  { id: "age", label: "Task 2: Age Calculator", view: <AgeCalculator /> },
];

export default function App() {
  const [active, setActive] = useState("color");

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: 6,
          padding: 6,
          borderRadius: 999,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 8px 25px -10px rgba(0,0,0,0.35)",
          maxWidth: "95vw",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: "8px 16px",
              border: 0,
              borderRadius: 999,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: active === t.id ? "#fff" : "#374151",
              background: active === t.id ? "#4338ca" : "transparent",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {TABS.find((t) => t.id === active).view}
    </>
  );
}