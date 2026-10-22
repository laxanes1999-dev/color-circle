import { useState } from "react";

// Add or remove colours here; the radio buttons update automatically.
const COLORS = [
  { label: "Green",  value: "#22c55e", text: "#fff" },
  { label: "Red",    value: "#ef4444", text: "#fff" },
  { label: "Blue",   value: "#3b82f6", text: "#fff" },
  { label: "Yellow", value: "#facc15", text: "#422006" },
  { label: "Orange", value: "#f97316", text: "#fff" },
  { label: "Purple", value: "#8b5cf6", text: "#fff" },
  { label: "Pink",   value: "#ec4899", text: "#fff" },
  { label: "Teal",   value: "#14b8a6", text: "#fff" },
];

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

const css = `
.cc-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  padding-top: clamp(4.5rem, 9vw, 5.5rem);   /* space for the tab bar */
  box-sizing: border-box;
  overflow: hidden;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  color: #e2e8f0;
  background: #0b1020;
}
/* soft colour glow in the background that follows the selected colour */
.cc-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.4;
  background: var(--c);
  pointer-events: none;
  transition: background-color 0.6s ease;
}
.cc-blob.one { width: 420px; height: 420px; top: -120px; left: -100px; }
.cc-blob.two { width: 360px; height: 360px; bottom: -120px; right: -80px; }
.cc-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  pointer-events: none;
}

.cc-card {
  position: relative;
  width: 100%;
  max-width: 980px;
  box-sizing: border-box;
  padding: clamp(1.25rem, 4vw, 2.75rem);
  border-radius: 28px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px -30px rgba(0,0,0,0.7);
}
.cc-head { text-align: center; margin-bottom: clamp(1.25rem, 4vw, 2.25rem); }
.cc-badge {
  display: inline-block;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #e2e8f0;
  background: rgba(var(--rgb), 0.22);
  border: 1px solid rgba(var(--rgb), 0.55);
  transition: all 0.4s ease;
}
.cc-title {
  margin: 0.8rem 0 0.4rem;
  font-size: clamp(1.7rem, 6vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  background: linear-gradient(90deg, #fff, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.cc-sub { margin: 0; color: #94a3b8; font-size: clamp(0.9rem, 2.6vw, 1.05rem); }

.cc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.25rem, 4vw, 2.5rem);
  align-items: center;
}
@media (min-width: 860px) { .cc-grid { grid-template-columns: 1fr 1fr; } }

/* ----- circle stage ----- */
.cc-stage { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
.cc-circle-wrap {
  position: relative;
  width: clamp(190px, 62vw, 360px);
  aspect-ratio: 1 / 1;
}
.cc-glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: var(--c);
  filter: blur(40px);
  opacity: 0.7;
  transition: background-color 0.5s ease;
}
.cc-ring {
  position: absolute;
  inset: -4%;
  border-radius: 50%;
  border: 2px dashed rgba(255,255,255,0.25);
  animation: cc-spin 30s linear infinite;
}
.cc-circle {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--c);
  background-image: radial-gradient(circle at 30% 28%, rgba(255,255,255,0.4), rgba(255,255,255,0) 55%);
  box-shadow: inset 0 -18px 40px rgba(0,0,0,0.18), 0 25px 60px -15px rgba(0,0,0,0.6);
  transition: background-color 0.45s ease, color 0.45s ease;
}
.cc-circle-text {
  font-weight: 800;
  letter-spacing: 0.1em;
  font-size: clamp(1.1rem, 5vw, 2rem);
}
.cc-codes { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
.cc-code {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(255,255,255,0.12);
}
.cc-code span { color: #94a3b8; font-weight: 500; }

/* ----- radio options ----- */
.cc-panel {
  padding: clamp(1rem, 3vw, 1.5rem);
  border-radius: 20px;
  background: rgba(15,23,42,0.45);
  border: 1px solid rgba(255,255,255,0.1);
}
.cc-panel-title { margin: 0 0 1rem; font-size: 0.95rem; font-weight: 600; color: #cbd5e1; }
.cc-radios {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  border: 0;
  margin: 0;
  padding: 0;
}
@media (min-width: 420px) { .cc-radios { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 860px) { .cc-radios { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .cc-radios { grid-template-columns: repeat(3, 1fr); } }

.cc-opt {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-radius: 14px;
  font-weight: 600;
  font-size: clamp(0.88rem, 2.6vw, 0.98rem);
  cursor: pointer;
  background: rgba(255,255,255,0.04);
  border: 1.5px solid rgba(255,255,255,0.1);
  transition: transform 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.cc-opt:hover { transform: translateY(-2px); background: rgba(255,255,255,0.09); }
.cc-opt.on {
  border-color: var(--oc);
  background: rgba(var(--orgb), 0.18);
  box-shadow: 0 8px 24px -10px var(--oc);
}
.cc-opt input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  inset: 0;
  margin: 0;
  cursor: pointer;
}
.cc-opt:focus-within { outline: 3px solid #fff; outline-offset: 2px; }
.cc-dot {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--oc);
  border: 2px solid rgba(255,255,255,0.8);
  box-shadow: 0 0 0 0 var(--oc);
  transition: box-shadow 0.25s;
}
.cc-opt.on .cc-dot { box-shadow: 0 0 0 4px rgba(var(--orgb), 0.35); }

@keyframes cc-spin { to { transform: rotate(360deg); } }

@media (orientation: landscape) and (max-height: 520px) {
  .cc-circle-wrap { width: min(55vh, 36vw); }
}
@media (prefers-reduced-motion: reduce) {
  .cc-ring { animation: none; }
  .cc-circle, .cc-glow, .cc-blob, .cc-opt, .cc-dot, .cc-badge { transition: none; }
}
`;

export default function ColorCircleFinal() {
  const [selected, setSelected] = useState(COLORS[1]); // Red by default

  return (
    <main className="cc-page" style={{ "--c": selected.value, "--rgb": hexToRgb(selected.value) }}>
      <style>{css}</style>
      <div className="cc-blob one" />
      <div className="cc-blob two" />

      <section className="cc-card">
        <header className="cc-head">
          <span className="cc-badge">RADIO BUTTON · REACT STATE</span>
          <h1 className="cc-title">Colour Fill Circle</h1>
          <p className="cc-sub">Select a colour and watch the circle fill instantly.</p>
        </header>

        <div className="cc-grid">
          {/* Circle */}
          <div className="cc-stage">
            <div className="cc-circle-wrap">
              <div className="cc-glow" />
              <div className="cc-ring" />
              <div
                className="cc-circle"
                style={{ color: selected.text }}
                aria-live="polite"
                aria-label={`Circle filled with ${selected.label}`}
              >
                <span className="cc-circle-text">{selected.label.toUpperCase()}</span>
              </div>
            </div>
            <div className="cc-codes">
              <div className="cc-code"><span>HEX </span>{selected.value.toUpperCase()}</div>
              <div className="cc-code"><span>RGB </span>{hexToRgb(selected.value)}</div>
            </div>
          </div>

          {/* Radio buttons */}
          <div className="cc-panel">
            <p className="cc-panel-title">Choose a colour</p>
            <fieldset className="cc-radios">
              <legend style={{ position: "absolute", left: "-9999px" }}>Fill colour</legend>
              {COLORS.map((c) => {
                const on = selected.label === c.label;
                return (
                  <label
                    key={c.label}
                    className={`cc-opt${on ? " on" : ""}`}
                    style={{ "--oc": c.value, "--orgb": hexToRgb(c.value) }}
                  >
                    <input
                      type="radio"
                      name="fill-colour"
                      checked={on}
                      onChange={() => setSelected(c)}
                    />
                    <span className="cc-dot" />
                    {c.label}
                  </label>
                );
              })}
            </fieldset>
          </div>
        </div>
      </section>
    </main>
  );
}
