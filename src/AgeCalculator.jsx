import { useEffect, useState } from "react";

/* ---------- Date helpers ---------- */
const pad = (n) => String(n).padStart(2, "0");
const formatDMY = (d) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const weekday = (d) => d.toLocaleDateString("en-US", { weekday: "long" });
const longDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// "2000-05-17" -> local Date (avoids timezone shifts)
const parseISO = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const utc = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
const DAY = 86400000;

// Date arithmetic: today - birth date => years / months / days
function calculateAge(birth, today) {
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // borrow the number of days in the month before today's month
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function nextBirthday(birth, today) {
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (utc(next) < utc(today)) next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  return { date: next, inDays: Math.round((utc(next) - utc(today)) / DAY) };
}

/* ---------- Count-up animation for the numbers ---------- */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Stat({ value, label, delay }) {
  const shown = useCountUp(value);
  return (
    <div className="ag-stat" style={{ animationDelay: `${delay}ms` }}>
      <b>{shown}</b>
      <span>{label}</span>
    </div>
  );
}

/* ---------- Styles ---------- */
const css = `
.ag-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
  overflow: hidden;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  color: #e2e8f0;
  background: radial-gradient(1200px 700px at 15% -10%, #1e2a5a 0%, transparent 60%),
              radial-gradient(900px 600px at 100% 110%, #3b1a5a 0%, transparent 55%),
              #0b1020;
}
/* subtle grid texture */
.ag-page::before {
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
/* floating glow blobs */
.ag-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.45;
  pointer-events: none;
  animation: ag-float 14s ease-in-out infinite;
}
.ag-blob.one { width: 340px; height: 340px; background: #6366f1; top: -80px; left: -60px; }
.ag-blob.two { width: 300px; height: 300px; background: #ec4899; bottom: -90px; right: -40px; animation-delay: -6s; }
@keyframes ag-float { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-25px); } }

.ag-card {
  position: relative;
  width: 100%;
  max-width: 960px;
  box-sizing: border-box;
  padding: clamp(1.25rem, 4vw, 2.75rem);
  border-radius: 28px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px -30px rgba(0,0,0,0.7);
}
.ag-head { text-align: center; margin-bottom: clamp(1.25rem, 4vw, 2.25rem); }
.ag-badge {
  display: inline-block;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #c7d2fe;
  background: rgba(99,102,241,0.2);
  border: 1px solid rgba(129,140,248,0.4);
}
.ag-title {
  margin: 0.8rem 0 0.4rem;
  font-size: clamp(1.7rem, 6vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  background: linear-gradient(90deg, #fff, #a5b4fc 55%, #f0abfc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ag-sub { margin: 0; color: #94a3b8; font-size: clamp(0.9rem, 2.6vw, 1.05rem); }

.ag-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 3vw, 2rem);
}
@media (min-width: 860px) { .ag-grid { grid-template-columns: 1fr 1.1fr; } }

.ag-label { display: block; margin-bottom: 0.45rem; font-weight: 600; font-size: 0.95rem; color: #cbd5e1; }
.ag-field { margin-bottom: 1.25rem; }
.ag-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem 0.95rem;
  font-size: 1rem;
  font-family: inherit;
  color: #f8fafc;
  color-scheme: dark;
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: 14px;
  background: rgba(15,23,42,0.6);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ag-input:hover { border-color: rgba(165,180,252,0.5); }
.ag-input:focus { outline: none; border-color: #818cf8; box-shadow: 0 0 0 4px rgba(129,140,248,0.2); }
.ag-chip {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #a5b4fc;
  background: rgba(99,102,241,0.15);
}
.ag-today {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.3rem 1rem;
  padding: 0.8rem 0.95rem;
  border-radius: 14px;
  font-weight: 600;
  background: rgba(15,23,42,0.6);
  border: 1.5px dashed rgba(255,255,255,0.18);
}
.ag-today span:last-child { color: #f0abfc; }

.ag-btn {
  width: 100%;
  padding: 0.95rem 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  font-family: inherit;
  color: #fff;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1, #a855f7 60%, #ec4899);
  box-shadow: 0 14px 30px -12px rgba(168,85,247,0.8);
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
}
.ag-btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 18px 36px -12px rgba(168,85,247,0.9); }
.ag-btn:active { transform: scale(0.98); }
.ag-btn:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
.ag-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; filter: none; box-shadow: none; }
.ag-error {
  margin-top: 1rem;
  padding: 0.75rem 0.95rem;
  border-radius: 12px;
  color: #fecaca;
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.4);
}

/* result side */
.ag-output {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 240px;
  padding: clamp(1rem, 3vw, 1.75rem);
  border-radius: 20px;
  background: linear-gradient(160deg, rgba(99,102,241,0.18), rgba(236,72,153,0.1));
  border: 1px solid rgba(255,255,255,0.12);
}
.ag-empty { text-align: center; color: #94a3b8; }
.ag-empty svg { width: 52px; height: 52px; margin-bottom: 0.6rem; opacity: 0.7; }
.ag-out-title { margin: 0 0 1rem; font-size: 0.95rem; font-weight: 600; color: #c7d2fe; }
.ag-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(0.4rem, 2vw, 0.8rem); }
.ag-stat {
  text-align: center;
  padding: clamp(0.7rem, 3vw, 1.1rem) 0.3rem;
  border-radius: 16px;
  background: rgba(15,23,42,0.55);
  border: 1px solid rgba(255,255,255,0.1);
  animation: ag-pop 0.5s ease both;
}
.ag-stat b { display: block; font-size: clamp(1.8rem, 7vw, 2.8rem); line-height: 1.1; color: #fff; }
.ag-stat span { font-size: 0.85rem; color: #a5b4fc; font-weight: 600; }

.ag-info { display: grid; gap: 0.6rem; margin-top: 1rem; }
.ag-info-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.2rem 1rem;
  padding: 0.7rem 0.95rem;
  border-radius: 12px;
  background: rgba(15,23,42,0.45);
  animation: ag-pop 0.5s ease both;
}
.ag-info-row span:first-child { color: #94a3b8; }
.ag-info-row strong { color: #f8fafc; text-align: right; }
.ag-info-row strong.hl { color: #f0abfc; }
@keyframes ag-pop { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .ag-blob, .ag-stat, .ag-info-row { animation: none; }
  .ag-btn, .ag-input { transition: none; }
}
`;

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [today, setToday] = useState(new Date()); // system date
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [runs, setRuns] = useState(0); // re-triggers animation on each click

  const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const dobDate = dob ? parseISO(dob) : null;

  const handleFind = () => {
    const now = new Date(); // refresh system date at the moment of click
    setToday(now);
    const birth = parseISO(dob);
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (birth > todayOnly) {
      setResult(null);
      setError("Date of birth cannot be in the future. Please pick a valid date.");
      return;
    }
    setError("");
    const nb = nextBirthday(birth, todayOnly);
    setResult({
      ...calculateAge(birth, todayOnly),
      day: weekday(birth),
      totalDays: Math.round((utc(todayOnly) - utc(birth)) / DAY),
      nextDate: nb.date,
      nextIn: nb.inDays,
    });
    setRuns((r) => r + 1);
  };

  return (
    <main className="ag-page">
      <style>{css}</style>
      <div className="ag-blob one" />
      <div className="ag-blob two" />

      <section className="ag-card">
        <header className="ag-head">
          <span className="ag-badge">DATE ARITHMETIC</span>
          <h1 className="ag-title">Evaluate Current Age</h1>
          <p className="ag-sub">Pick your date of birth and get your exact age in years, months and days.</p>
        </header>

        <div className="ag-grid">
          {/* Left: inputs */}
          <div>
            <div className="ag-field">
              <label className="ag-label" htmlFor="dob">Enter your Date of Birth</label>
              <input
                id="dob"
                type="date"
                className="ag-input"
                value={dob}
                max={todayISO}
                onChange={(e) => {
                  setDob(e.target.value);
                  setResult(null);
                  setError("");
                }}
              />
              <span className="ag-chip">{dobDate ? formatDMY(dobDate) : "DD-MM-YYYY"}</span>
            </div>

            <div className="ag-field">
              <span className="ag-label">System Date (Today's date)</span>
              <div className="ag-today">
                <span>{formatDMY(today)}</span>
                <span>{weekday(today)}</span>
              </div>
            </div>

            <button className="ag-btn" onClick={handleFind} disabled={!dob}>
              Find Present Age
            </button>
            {error && <div className="ag-error" role="alert">{error}</div>}
          </div>

          {/* Right: result */}
          <div className="ag-output" aria-live="polite">
            {!result ? (
              <div className="ag-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="16" rx="3" />
                  <path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
                <div>Your result will appear here</div>
              </div>
            ) : (
              <div key={runs}>
                <p className="ag-out-title">Current age</p>
                <div className="ag-stats">
                  <Stat value={result.years} label="Years" delay={0} />
                  <Stat value={result.months} label="Months" delay={120} />
                  <Stat value={result.days} label="Days" delay={240} />
                </div>
                <div className="ag-info">
                  <div className="ag-info-row" style={{ animationDelay: "320ms" }}>
                    <span>Day of birth</span>
                    <strong className="hl">{result.day}</strong>
                  </div>
                  <div className="ag-info-row" style={{ animationDelay: "400ms" }}>
                    <span>Total days lived</span>
                    <strong>{result.totalDays.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="ag-info-row" style={{ animationDelay: "480ms" }}>
                    <span>Next birthday</span>
                    <strong>
                      {result.nextIn === 0 ? "Today!" : `in ${result.nextIn} days`} · {longDate(result.nextDate)}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
