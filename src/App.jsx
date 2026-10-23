import { useEffect, useState } from "react";
import ColorCircleFinal from "./ColorCircleFinal";
import AgeCalculator from "./AgeCalculator";

// Each task has its own link:  <site>/#/colour-circle   and   <site>/#/age-calculator
const TABS = [
  { path: "colour-circle", label: "Task 1: Colour Circle", view: <ColorCircleFinal /> },
  { path: "age-calculator", label: "Task 2: Age Calculator", view: <AgeCalculator /> },
];

// Hash routing works on GitHub Pages and localhost without any server rewrite rules.
const getRoute = () => window.location.hash.replace(/^#\/?|\/$/g, "");

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHash = () => { setRoute(getRoute()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // empty or unknown hash -> first task
  const active = TABS.find((t) => t.path === route) || TABS[0];

  useEffect(() => {
    document.title = active.label;
  }, [active]);

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
          <a
            key={t.path}
            href={`#/${t.path}`}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              color: active.path === t.path ? "#fff" : "#374151",
              background: active.path === t.path ? "#4338ca" : "transparent",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </a>
        ))}
      </nav>

      {active.view}
    </>
  );
}