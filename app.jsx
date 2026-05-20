/* global React, ReactDOM, FitCalc, FOOD_DATA, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakButton */
const { useState, useMemo, useEffect, useRef, useCallback } = React;

// --------- Tweaks defaults ---------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sage",
  "density": "cozy"
}/*EDITMODE-END*/;

// --------- Unit helpers ---------
const LB_PER_KG = 2.20462;
const fmtWeight = (kg, unit, decimals = 1) => {
  const v = unit === "lb" ? kg * LB_PER_KG : kg;
  return Math.round(v * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
const unitLabel = (unit) => unit === "lb" ? "lb" : "kg";
// Standard rate options per unit (stored as kg/wk internally)
const RATE_OPTIONS_KG = [0.25, 0.5, 0.75, 1.0];
const RATE_OPTIONS_LB = [0.5, 1.0, 1.5, 2.0]; // displayed; stored as lb/LB_PER_KG kg


// --------- Icons (minimal) ---------
const Icon = ({ d, sz = 14 }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  calc: "M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 7h6M8.5 11h1m2.5 0h1m2.5 0h1M8.5 14h1m2.5 0h1m2.5 0h1M8.5 17h1m2.5 0h1m2.5 0h1",
  chart: "M3 3v18h18M7 14l3-3 4 4 5-6",
  leaf: "M12 21V11M5 12c0-4 3-7 7-7s7 3 7 7c0 5-7 9-7 9s-7-4-7-9z",
  msg: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9 8.5 8.5 0 0 1 8.5 8.5z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  reset: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
};

// --------- App ---------
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = useState("calculator");
  const [input, setInput] = useState({ age: null, gender: null, weight: null, height: null, activity: null, goal: null, rate: null, neck: null, waist: null, hip: null });
  const [metrics, setMetrics] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const [weightUnit, setWeightUnit] = useState("kg");

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.palette, t.density]);

  const handleCompute = (next) => {
    setInput(next);
    setMetrics(FitCalc.computeAll(next));
    setCalculated(true);
    setTab("dashboard");
  };

  return (
    <div className="app">
      <Header tab={tab} setTab={setTab} calculated={calculated} />
      <main>
        {tab === "calculator" && <CalculatorScreen input={input} onCompute={handleCompute} weightUnit={weightUnit} setWeightUnit={setWeightUnit} />}
        {tab === "dashboard" && <DashboardScreen metrics={metrics} fresh={calculated} onRecompute={() => setTab("calculator")} weightUnit={weightUnit} />}
        {tab === "nutrition" && <NutritionScreen target={metrics?.protein} />}
        {tab === "coach" && <CoachScreen metrics={metrics} calculated={calculated} />}
        <Footer />
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakRadio label="Theme" value={t.palette} onChange={(v) => setTweak("palette", v)} options={["sage", "mono", "energy"]} />
        </TweakSection>
        <TweakSection label="Density">
          <TweakRadio label="Spacing" value={t.density} onChange={(v) => setTweak("density", v)} options={["cozy", "compact"]} />
        </TweakSection>

      </TweaksPanel>
    </div>
  );
}

// --------- Header ---------
function Header({ tab, setTab, calculated }) {
  const items = [
    { id: "calculator", label: "Calculator", icon: ICONS.calc },
    { id: "dashboard", label: "Dashboard", icon: ICONS.chart },
    { id: "nutrition", label: "Nutrition", icon: ICONS.leaf },
    { id: "coach", label: "Coach", icon: ICONS.msg },
  ];
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <a className="brand" href="#">
          <span className="brand-mark">F</span>
          <span>FitHeal</span>
        </a>
        <nav className="tabs" role="tablist">
          {items.map(it => (
            <button key={it.id} className="tab" role="tab" aria-current={tab === it.id ? "true" : "false"} onClick={() => setTab(it.id)}>
              <Icon d={it.icon} />
              {it.label}
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
}

// --------- Calculator screen ---------
function CalculatorScreen({ input, onCompute, weightUnit, setWeightUnit }) {
  const [form, setForm] = useState(input);
  const set = (patch) => setForm({ ...form, ...patch });
  const submit = (e) => {
    e?.preventDefault();
    if (!form.age || !form.weight || !form.height || !form.gender || !form.activity || !form.goal) return;
    onCompute({ ...form, neck: form.neck || null, waist: form.waist || null, hip: form.hip || null });
  };
  const showRate = form.goal === "weight_loss" || form.goal === "weight_gain";

  return (
    <div className="fade-in">
      <section className="hero">
        <div>
          <p className="eyebrow">01 · Inputs</p>
          <h1 className="display">Your numbers,<br /><em>made legible.</em></h1>
          <p className="lede">Enter the basics. We compute BMI, BMR, TDEE, lean mass, body fat, daily calories and macro targets — then surface the actionable handful you actually need.</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><span className="num">4</span><div className="label">Core metrics</div></div>
          <div className="hero-stat"><span className="num">3</span><div className="label">Macro targets</div></div>
          <div className="hero-stat"><span className="num">12<span style={{ color: 'var(--ink-3)', fontSize: '14px' }}>wk</span></span><div className="label">Projection</div></div>
        </div>
      </section>

      <form className="card elevated" onSubmit={submit} style={{ padding: '28px' }}>
        <div className="card-head">
          <div>
            <h2>Profile</h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>Honest numbers in, useful numbers out.</p>
          </div>
          <span className="label" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>REQUIRED ·  6 fields</span>
        </div>

        <div className="form-grid">
          <Field className="col-3" label="Age">
            <div className="input-wrap">
              <input className="input with-suffix" type="number" min="1" max="120" required value={form.age || ""} onChange={(e) => set({ age: +e.target.value || null })} />
              <span className="suffix">Y</span>
            </div>
          </Field>
          <Field className="col-3" label="Gender">
            <div className="segmented">
              <button type="button" aria-pressed={form.gender === "male"} onClick={() => set({ gender: "male" })}>Male</button>
              <button type="button" aria-pressed={form.gender === "female"} onClick={() => set({ gender: "female" })}>Female</button>
            </div>
          </Field>
          <Field className="col-3" label="Weight">
            <div className="input-wrap">
              <input
                className="input with-toggle"
                type="number"
                min="1"
                step="0.1"
                required
                value={form.weight ? (weightUnit === "kg" ? form.weight : Math.round(form.weight * 2.20462 * 10) / 10) : ""}
                onChange={(e) => {
                  const v = +e.target.value;
                  if (!v) return set({ weight: null });
                  const kg = weightUnit === "kg" ? v : v / 2.20462;
                  set({ weight: Math.round(kg * 10) / 10 });
                }}
              />
              <div className="unit-toggle" role="group" aria-label="Weight unit">
                <button type="button" aria-pressed={weightUnit === "kg"} onClick={() => setWeightUnit("kg")}>kg</button>
                <button type="button" aria-pressed={weightUnit === "lb"} onClick={() => setWeightUnit("lb")}>lb</button>
              </div>
            </div>
          </Field>
          <Field className="col-3" label="Height">
            <div className="input-wrap">
              <input className="input with-suffix" type="number" min="1" step="0.1" required value={form.height || ""} onChange={(e) => set({ height: +e.target.value || null })} />
              <span className="suffix">cm</span>
            </div>
          </Field>

          <Field className="col-12" label="Activity level">
            <div className="option-cards">
              {[
                { v: 1.2, n: "Sedentary", d: "Little / no exercise" },
                { v: 1.375, n: "Light", d: "1–3 days exercise / week" },
                { v: 1.55, n: "Moderate", d: "3–5 days exercise / week" },
                { v: 1.725, n: "Very Active", d: "6–7 days exercise / week" },
                { v: 1.9, n: "Extra", d: "Daily exercise + physical job" },
              ].map(o => (
                <button key={o.v} type="button" className="option-card" aria-pressed={form.activity === o.v} onClick={() => set({ activity: o.v })}>
                  <span className="name">{o.n}</span>
                  <span className="desc">{o.d}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field className={showRate ? "col-6" : "col-12"} label="Goal">
            <div className="option-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                { v: "weight_loss", n: "Lose", d: "Caloric deficit" },
                { v: "stay_healthy", n: "Maintain", d: "At maintenance" },
                { v: "weight_gain", n: "Gain", d: "Caloric surplus" },
              ].map(o => (
                <button key={o.v} type="button" className="option-card" aria-pressed={form.goal === o.v} onClick={() => set({ goal: o.v })}>
                  <span className="name">{o.n}</span>
                  <span className="desc">{o.d}</span>
                </button>
              ))}
            </div>
          </Field>

          {showRate && (
            <Field className="col-6" label="Rate">
              <div className="option-cards" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {(weightUnit === "lb" ? RATE_OPTIONS_LB : RATE_OPTIONS_KG).map(r => {
                  const kg = weightUnit === "lb" ? r / LB_PER_KG : r;
                  const selected = form.rate && Math.abs(form.rate - kg) < 0.01;
                  return (
                    <button key={r} type="button" className="option-card" aria-pressed={!!selected} onClick={() => set({ rate: Math.round(kg * 10000) / 10000 })}>
                      <span className="name num" style={{ fontFamily: 'var(--font-mono)' }}>{r.toFixed(2)}</span>
                      <span className="desc">{unitLabel(weightUnit)} / wk</span>
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          <div className="divider-row"><span>Optional · for Navy body-fat method</span></div>

          <Field className="col-4" label="Neck">
            <div className="input-wrap">
              <input className="input with-suffix" type="number" step="0.1" min="1" value={form.neck || ""} placeholder="" onChange={(e) => set({ neck: +e.target.value || null })} />
              <span className="suffix">cm</span>
            </div>
          </Field>
          <Field className="col-4" label="Waist">
            <div className="input-wrap">
              <input className="input with-suffix" type="number" step="0.1" min="1" value={form.waist || ""} placeholder="" onChange={(e) => set({ waist: +e.target.value || null })} />
              <span className="suffix">cm</span>
            </div>
          </Field>
          <Field className="col-4" label="Hip" hint={form.gender === "female" ? null : "Women only"}>
            <div className="input-wrap">
              <input className="input with-suffix" type="number" step="0.1" min="1" value={form.hip || ""} placeholder="" disabled={form.gender !== "female"} onChange={(e) => set({ hip: +e.target.value || null })} />
              <span className="suffix">cm</span>
            </div>
          </Field>
        </div>

        <div className="button-row">
          <button type="submit" className="button primary">
            Compute metrics
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </button>
          <button type="button" className="button ghost" onClick={() => setForm({ age: null, gender: null, weight: null, height: null, activity: null, goal: null, rate: null, neck: null, waist: null, hip: null })}>Reset</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, className, children }) {
  return (
    <div className={`field ${className || ""}`}>
      <div className="field-label">
        <span>{label}</span>
        {hint && <span className="hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// --------- Dashboard screen ---------
function DashboardScreen({ metrics, fresh, onRecompute, weightUnit }) {
  if (!metrics) {
    return (
      <div className="empty">
        <h3>No metrics yet</h3>
        <p>Fill the calculator to populate your dashboard.</p>
        <button className="button primary" onClick={onRecompute}>Open calculator</button>
      </div>
    );
  }
  const m = metrics;
  const u = unitLabel(weightUnit);
  const wt = (kg, d = 1) => fmtWeight(kg, weightUnit, d);
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p className="eyebrow">02 · Snapshot</p>
          <h1 className="display" style={{ fontSize: 'clamp(36px,4.6vw,52px)', marginBottom: 8 }}>Your dashboard.</h1>
          <p className="lede">Updated for a {m.input.gender}, {m.input.age}y, {wt(m.input.weight)}{u} / {m.input.height}cm · {({ 1.2: "Sedentary", 1.375: "Light", 1.55: "Moderate", 1.725: "Very Active", 1.9: "Extra Active" })[m.input.activity] || "Active"} activity.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="button ghost" onClick={() => downloadReport(m, weightUnit)}>
            <Icon d={ICONS.download} sz={14} />
            Download report
          </button>
          <button className="button ghost" onClick={onRecompute}>
            <Icon d={ICONS.reset} sz={14} />
            Edit inputs
          </button>
        </div>
      </div>

      <div className="metric-row">
        <MetricCard label="BMI" value={m.bmi} unit="" sub={<span style={{ color: m.bmiCategory.color }}>{m.bmiCategory.name}</span>} />
        <MetricCard label="BMR" value={m.bmr.toLocaleString()} unit="kcal" sub="At-rest energy" />
        <MetricCard label="TDEE" value={m.tdee.toLocaleString()} unit="kcal" sub="Maintenance need" />
        <MetricCard label="Lean Mass" value={wt(m.lbm)} unit={u} sub={`Boer · ${(m.lbm / m.input.weight * 100).toFixed(0)}% of body`} />
      </div>

      <div className="dash-grid">
        <div className="card elevated bmi-card">
          <div className="card-head">
            <div>
              <h2>Body composition</h2>
              <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>Where you sit on the BMI scale, and what it splits into.</p>
            </div>
            <span className="label" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{m.bodyFatMethod.toUpperCase()} METHOD</span>
          </div>
          <div className="bmi-gauge-wrap">
            <BMIGauge bmi={m.bmi} />
            <div className="bmi-readout">
              <div className="big num">{m.bmi.toFixed(1)}</div>
              <div className="cat" style={{ color: m.bmiCategory.color }}>{m.bmiCategory.name}</div>
              <div className="scale-key">
                <div><span className="swatch" style={{ background: 'oklch(0.62 0.12 240)' }} />Under &lt; 18.5</div>
                <div><span className="swatch" style={{ background: 'oklch(0.55 0.13 145)' }} />Normal 18.5–25</div>
                <div><span className="swatch" style={{ background: 'oklch(0.72 0.16 75)' }} />Over 25–30</div>
                <div><span className="swatch" style={{ background: 'oklch(0.58 0.18 28)' }} />Obese &gt; 30</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            <BreakdownStat label="Body fat" v={`${m.bodyFat.toFixed(1)}%`} sub={`${wt(m.bodyFatKg)} ${u}`} />
            <BreakdownStat label="Lean (from BF)" v={`${wt(m.lbmFromBf)} ${u}`} sub={`${(m.lbmFromBf / m.input.weight * 100).toFixed(0)}% of body`} />
            <BreakdownStat label="Weight" v={`${wt(m.input.weight)} ${u}`} sub="Current" />
          </div>
        </div>

        <div className="dash-stack">
          <div className="card elevated">
            <div className="card-head">
              <div>
                <h2>Daily target</h2>
                <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>What to eat tomorrow.</p>
              </div>
            </div>
            <div className="daily-target">
              <div>
                <div className="num-big">{m.dailyKcal.toLocaleString()}<span className="unit">kcal/d</span></div>
              </div>
              <div className="target-rows">
                <div className="target-row"><span className="lbl">TDEE</span><span className="vl">{m.tdee.toLocaleString()}</span></div>
                <div className="target-row"><span className="lbl">Adjustment</span><span className={`vl ${m.dailyKcal < m.tdee ? "minus" : m.dailyKcal > m.tdee ? "plus" : ""}`}>{m.dailyKcal === m.tdee ? "—" : `${m.dailyKcal > m.tdee ? "+" : ""}${(m.dailyKcal - m.tdee).toLocaleString()}`}</span></div>
                <div className="target-row"><span className="lbl">Goal</span><span className="vl">{goalLabel(m.input.goal)}{m.input.rate ? ` · ${wt(m.input.rate, 2)} ${u}/wk` : ""}</span></div>
              </div>
            </div>
          </div>

          <div className="card elevated">
            <div className="card-head">
              <div>
                <h2>Macros</h2>
                <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>Split of your daily kcal.</p>
              </div>
            </div>
            <div className="macros-card">
              <MacroDonut p={m.proteinKcal} c={m.carbsKcal} f={m.fatKcal} />
              <div className="macro-rows">
                {[
                  { id: "p", nm: "Protein", g: m.protein, kc: m.proteinKcal, color: 'var(--primary)' },
                  { id: "c", nm: "Carbs", g: m.carbs, kc: m.carbsKcal, color: 'var(--accent)' },
                  { id: "f", nm: "Fat", g: m.fat, kc: m.fatKcal, color: 'var(--ink-2)' },
                ].map(r => (
                  <div className="macro-row" key={r.id}>
                    <span className="sw" style={{ background: r.color }} />
                    <span className="nm">{r.nm}</span>
                    <span className="gm">{r.g}<span style={{ color: 'var(--ink-3)', marginLeft: 4 }}>g</span></span>
                    <span className="kc">{r.kc} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card elevated projection-card" style={{ marginTop: 14 }}>
        <div className="card-head">
          <div>
            <h2>12-week projection</h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>Where this calorie target takes you, assuming consistency.</p>
          </div>
          <span className="label" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>1 kg ≈ 7,700 kcal</span>
        </div>
        <ProjectionChart metrics={m} weightUnit={weightUnit} />
        <div className="projection-legend">
          <div>Per week: <span className="num">{wt(projectionDelta(m, 1), 2)} {u}</span></div>
          <div>Per month: <span className="num">{wt(projectionDelta(m, 4.3), 2)} {u}</span></div>
          <div>Per 12 weeks: <span className="num">{wt(projectionDelta(m, 12), 1)} {u}</span></div>
          <div>Net kcal / week: <span className="num">{((m.dailyKcal - m.tdee) * 7).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

function projectionDelta(m, weeks) {
  return ((m.dailyKcal - m.tdee) * 7 * weeks) / 7700;
}
function goalLabel(g) {
  return { weight_loss: "Lose weight", weight_gain: "Gain weight", stay_healthy: "Maintain" }[g] || "—";
}

function MetricCard({ label, value, unit, sub }) {
  return (
    <div className="metric">
      <div className="label"><span>{label}</span></div>
      <div className="value">{value}<span className="unit">{unit}</span></div>
      <div className="sub">{sub}</div>
    </div>
  );
}
function BreakdownStat({ label, v, sub }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>{v}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// --------- Charts ---------
function BMIGauge({ bmi }) {
  // half-circle gauge, 15..40 BMI
  const min = 15, max = 40;
  const clamp = Math.max(min, Math.min(max, bmi));
  const pct = (clamp - min) / (max - min);
  const angle = -180 + pct * 180; // -180..0 (left to right)
  const cx = 130, cy = 130, r = 100;
  const segs = [
    { from: 15, to: 18.5, color: 'oklch(0.62 0.12 240)' },
    { from: 18.5, to: 25, color: 'oklch(0.55 0.13 145)' },
    { from: 25, to: 30, color: 'oklch(0.72 0.16 75)' },
    { from: 30, to: 40, color: 'oklch(0.58 0.18 28)' },
  ];
  const polar = (a) => ({ x: cx + r * Math.cos((a * Math.PI) / 180), y: cy + r * Math.sin((a * Math.PI) / 180) });
  const arcPath = (a0, a1, rr = r) => {
    const p0 = { x: cx + rr * Math.cos((a0 * Math.PI) / 180), y: cy + rr * Math.sin((a0 * Math.PI) / 180) };
    const p1 = { x: cx + rr * Math.cos((a1 * Math.PI) / 180), y: cy + rr * Math.sin((a1 * Math.PI) / 180) };
    return `M ${p0.x} ${p0.y} A ${rr} ${rr} 0 0 1 ${p1.x} ${p1.y}`;
  };
  const needle = polar(angle);
  return (
    <svg viewBox="0 0 260 160" style={{ width: '100%', maxWidth: 340, display: 'block' }}>
      <g>
        {segs.map((s, i) => {
          const a0 = -180 + ((s.from - min) / (max - min)) * 180;
          const a1 = -180 + ((s.to - min) / (max - min)) * 180;
          return <path key={i} d={arcPath(a0, a1)} fill="none" stroke={s.color} strokeWidth="18" strokeLinecap="butt" opacity="0.85" />;
        })}
        {/* Ticks */}
        {[18.5, 25, 30].map((v, i) => {
          const a = -180 + ((v - min) / (max - min)) * 180;
          const inn = { x: cx + (r - 14) * Math.cos((a * Math.PI) / 180), y: cy + (r - 14) * Math.sin((a * Math.PI) / 180) };
          const out = { x: cx + (r + 6) * Math.cos((a * Math.PI) / 180), y: cy + (r + 6) * Math.sin((a * Math.PI) / 180) };
          const lbl = { x: cx + (r + 18) * Math.cos((a * Math.PI) / 180), y: cy + (r + 18) * Math.sin((a * Math.PI) / 180) };
          return (
            <g key={i}>
              <line x1={inn.x} y1={inn.y} x2={out.x} y2={out.y} stroke="var(--surface-2)" strokeWidth="2" />
              <text x={lbl.x} y={lbl.y + 4} fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">{v}</text>
            </g>
          );
        })}
        {/* needle */}
        <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="8" fill="var(--ink)" />
        <circle cx={cx} cy={cy} r="3" fill="var(--surface-2)" />
      </g>
    </svg>
  );
}

function MacroDonut({ p, c, f }) {
  const total = p + c + f || 1;
  const segs = [
    { v: p, color: 'var(--primary)' },
    { v: c, color: 'var(--accent)' },
    { v: f, color: 'var(--ink-2)' },
  ];
  const cx = 90, cy = 90, r = 70, sw = 22;
  const C = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg viewBox="0 0 180 180" style={{ width: '100%', maxWidth: 200, display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface)" strokeWidth={sw} />
      {segs.map((s, i) => {
        const len = (s.v / total) * C;
        const el = (
          <circle key={i}
            cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${len} ${C}`}
            strokeDashoffset={-off}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
        off += len + 2; // small gap
        return el;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="22" fontWeight="500" fill="var(--ink)" letterSpacing="-1">{total.toLocaleString()}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="1">KCAL / DAY</text>
    </svg>
  );
}

function ProjectionChart({ metrics, weightUnit }) {
  const m = metrics;
  const weeks = 12;
  const conv = (kg) => weightUnit === "lb" ? kg * LB_PER_KG : kg;
  const points = Array.from({ length: weeks + 1 }, (_, i) => {
    const w = conv(m.input.weight + projectionDelta(m, i));
    return { x: i, y: w };
  });
  const u = unitLabel(weightUnit);
  const w = 1000, h = 220, padX = 46, padY = 24;
  const ys = points.map(p => p.y);
  const yMin = Math.min(...ys) - 1.5;
  const yMax = Math.max(...ys) + 1.5;
  const xScale = (i) => padX + (i / weeks) * (w - padX * 2);
  const yScale = (y) => padY + (1 - (y - yMin) / (yMax - yMin)) * (h - padY * 2);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x).toFixed(1)} ${yScale(p.y).toFixed(1)}`).join(" ");
  const areaPath = path + ` L ${xScale(weeks)} ${h - padY} L ${xScale(0)} ${h - padY} Z`;
  const trending = points[weeks].y < points[0].y ? "var(--primary)" : points[weeks].y > points[0].y ? "var(--accent)" : "var(--ink-2)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }} className="chart">
      <defs>
        <linearGradient id="proj-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={trending} stopOpacity="0.18" />
          <stop offset="100%" stopColor={trending} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* horizontal grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const yy = padY + t * (h - padY * 2);
        const lbl = `${(yMax - t * (yMax - yMin)).toFixed(1)} ${u}`;
        return (
          <g key={i}>
            <line x1={padX} x2={w - padX} y1={yy} y2={yy} stroke="var(--line)" strokeDasharray={i === 0 || i === 4 ? "" : "2 4"} />
            <text x={6} y={yy + 4} fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-3)">{lbl}</text>
          </g>
        );
      })}
      {/* x ticks (weeks 0,4,8,12) */}
      {[0, 4, 8, 12].map(i => (
        <g key={i}>
          <text x={xScale(i)} y={h - 6} fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">W{i}</text>
        </g>
      ))}
      <path d={areaPath} fill="url(#proj-grad)" />
      <path d={path} fill="none" stroke={trending} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => i % 2 === 0 && (
        <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r="3" fill="var(--surface-2)" stroke={trending} strokeWidth="1.5" />
      ))}
      {/* end label */}
      <g transform={`translate(${xScale(weeks) - 8} ${yScale(points[weeks].y) - 14})`}>
        <text fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink)" textAnchor="end" fontWeight="600">{points[weeks].y.toFixed(1)} {u}</text>
      </g>
    </svg>
  );
}

// --------- Nutrition screen ---------
function NutritionScreen({ target }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("protein_desc");
  const filtered = useMemo(() => {
    let list = FOOD_DATA.filter(f =>
      (filter === "all" || f.type === filter) &&
      f.name.toLowerCase().includes(q.toLowerCase())
    );
    const sorts = {
      protein_desc: (a, b) => b.protein - a.protein,
      protein_density: (a, b) => (b.protein / b.kcal) - (a.protein / a.kcal),
      kcal_asc: (a, b) => a.kcal - b.kcal,
      kcal_desc: (a, b) => b.kcal - a.kcal,
      name_asc: (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(sorts[sort] || sorts.protein_desc);
  }, [q, filter, sort]);
  const counts = useMemo(() => ({
    all: FOOD_DATA.length,
    veg: FOOD_DATA.filter(f => f.type === "veg").length,
    nonveg: FOOD_DATA.filter(f => f.type === "nonveg").length,
  }), []);
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p className="eyebrow">03 · Nutrition</p>
          <h1 className="display" style={{ fontSize: 'clamp(36px,4.6vw,52px)', marginBottom: 8 }}>High-protein sources.</h1>
          <p className="lede">Curated list — every entry shows kcal, protein, carbs, fat per serving. Sort by protein density to find the most efficient picks for your{target ? ` ${target}g/day target` : " target"}.</p>
        </div>
      </div>

      <div className="nutrition-toolbar">
        <div className="search-wrap">
          <input type="text" placeholder="Search foods…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="chip-row">
          <button className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All <span className="count">{counts.all}</span></button>
          <button className="chip" aria-pressed={filter === "veg"} onClick={() => setFilter("veg")}>Veg <span className="count">{counts.veg}</span></button>
          <button className="chip" aria-pressed={filter === "nonveg"} onClick={() => setFilter("nonveg")}>Non-veg <span className="count">{counts.nonveg}</span></button>
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="protein_desc">Sort: Protein (high → low)</option>
          <option value="protein_density">Sort: Protein per kcal</option>
          <option value="kcal_asc">Sort: kcal (low → high)</option>
          <option value="kcal_desc">Sort: kcal (high → low)</option>
          <option value="name_asc">Sort: Name (A → Z)</option>
        </select>
      </div>

      <div className="food-grid">
        {filtered.map((f, i) => (
          <FoodCard key={i} food={f} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty"><h3>No matches</h3><p>Try clearing the search or filter.</p></div>
      )}
    </div>
  );
}

function FoodCard({ food }) {
  return (
    <article className="food-card">
      <div className="top">
        <div className="name">{food.name}</div>
        <span className={food.type === "veg" ? "tag-veg" : "tag-nonveg"}>{food.type === "veg" ? "VEG" : "NON-VEG"}</span>
      </div>
      <div className="nutrients">
        <div className="n"><div className="vk">{food.kcal}</div><div className="lk">kcal</div></div>
        <div className="n protein"><div className="vk">{food.protein}g</div><div className="lk">Protein</div></div>
        <div className="n"><div className="vk">{food.carbs}g</div><div className="lk">Carbs</div></div>
        <div className="n"><div className="vk">{food.fat}g</div><div className="lk">Fat</div></div>
      </div>
      <div className="meta">
        <span>{food.serving}</span>
        {food.link && <a href={food.link} target="_blank" rel="noreferrer" className="link">Buy →</a>}
      </div>
    </article>
  );
}

// --------- Markdown renderer (for coach responses) ---------
function parseMarkdown(text) {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const lines = text.split('\n');
  let inList = false;
  const result = [];
  for (const line of lines) {
    if (line.trim().match(/^[*-]\s+(.+)/)) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${line.trim().replace(/^[*-]\s+/, '')}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      if (line.trim()) result.push(line);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('<br>')
    .replace(/<br><ul>/g, '<ul>')
    .replace(/<\/ul><br>/g, '</ul>')
    .replace(/<br><\/ul>/g, '</ul>');
}

// --------- Coach helpers ---------
function detectFoodIntent(msg) {
  const kws = ['food','meal','eat','diet','nutrition','recipe','breakfast','lunch','dinner','snack',
    'protein','calories','cook','dish','vegetarian','vegan','non-veg','plan','menu',
    'carb','fat','macro','calorie','intake','consume','grocery','ingredient'];
  const lower = msg.toLowerCase();
  const hasFoodKw = kws.some(k => lower.includes(k));
  const isQ = lower.includes('?') || /^(what|which|how|can)/.test(lower) ||
    lower.includes('should i') || lower.includes('can i') ||
    lower.includes('give me') || lower.includes('suggest') || lower.includes('recommend');
  return hasFoodKw && isQ;
}

function detectFoodDislike(msg) {
  const patterns = [
    /(?:i )?don'?t like (.+)/i, /(?:i )?hate (.+)/i, /(?:i )?can'?t stand (.+)/i,
    /(?:i )?don'?t want (.+)/i, /(?:i'm|i am) not a fan of (.+)/i, /(?:i )?dislike (.+)/i,
    /\bnot (.+)/i, /\bavoid (.+)/i, /\bskip (.+)/i, /\bwithout (.+)/i,
    /\bexcept (.+)/i, /\bremove (.+)/i,
  ];
  for (const p of patterns) {
    const m = msg.match(p);
    if (m?.[1]) return m[1].replace(/\s+(please|plz|thanks|thank you)$/i, '').trim();
  }
  return null;
}

function getDietaryLabel(v) {
  return { veg: 'Vegetarian', 'non-veg': 'Non-Vegetarian', 'egg-veg': 'Egg + Vegetarian', vegan: 'Vegan' }[v] || v;
}

function getFilteredFoodList(dietary, allergies, disliked = []) {
  let foods = [];
  if (dietary === 'veg') {
    foods = FOOD_DATA.filter(f => f.type === 'veg');
  } else if (dietary === 'egg-veg') {
    foods = FOOD_DATA.filter(f => f.type === 'veg');
    const egg = FOOD_DATA.find(f => f.name === 'Eggs');
    if (egg) foods.push(egg);
  } else if (dietary === 'non-veg') {
    foods = FOOD_DATA.filter(f => f.type === 'veg');
    ['Chicken Breast', 'Eggs'].forEach(n => {
      const f = FOOD_DATA.find(x => x.name === n);
      if (f) foods.push(f);
    });
  } else if (dietary === 'vegan') {
    foods = FOOD_DATA.filter(f => {
      const n = f.name.toLowerCase();
      return f.type === 'veg' && !n.includes('paneer') && !n.includes('yogurt') &&
             !n.includes('skyr') && !n.includes('milk') && !n.includes('dairy') && !n.includes('whey');
    });
  }
  if (allergies && allergies !== 'none') {
    const allergens = allergies.toLowerCase().split(',').map(a => a.trim());
    foods = foods.filter(f => !allergens.some(a => f.name.toLowerCase().includes(a)));
  }
  if (disliked.length) {
    foods = foods.filter(f => !disliked.some(d =>
      f.name.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(f.name.toLowerCase())
    ));
  }
  return foods;
}

function buildFoodListContext(dietary, allergies, disliked) {
  const foods = getFilteredFoodList(dietary, allergies, disliked);
  if (!foods.length) return "No specific foods available for your dietary restrictions.";
  let ctx = "AVAILABLE FOOD LIST (use these for recommendations):\n\n";
  foods.forEach((f, i) => {
    ctx += `${i + 1}. ${f.name} (${f.serving})\n`;
    ctx += `   - Calories: ${f.kcal} kcal\n`;
    ctx += `   - Protein: ${f.protein}g | Carbs: ${f.carbs}g | Fat: ${f.fat}g\n`;
    if (f.link) ctx += `   - Product Link: ${f.link}\n`;
    ctx += '\n';
  });
  return ctx;
}

function buildAIContext(metrics) {
  const inp = metrics.input;
  const actDesc = ({
    1.2: 'Sedentary (little or no exercise)',
    1.375: 'Lightly Active (light exercise 1-3 days/week)',
    1.55: 'Moderately Active (moderate exercise 3-5 days/week)',
    1.725: 'Very Active (hard exercise 6-7 days/week)',
    1.9: 'Extra Active (very hard exercise, physical job)',
  })[inp.activity] || 'Unknown';
  const bmiCat = metrics.bmi < 18.5 ? 'Underweight' : metrics.bmi < 25 ? 'Normal Weight' : metrics.bmi < 30 ? 'Overweight' : 'Obese';
  const goalTxt = inp.goal === 'weight_loss' ? 'Weight Loss' : inp.goal === 'weight_gain' ? 'Weight Gain' : 'Stay Healthy (Maintenance)';
  return `User Fitness Profile:
- Age: ${inp.age} years old
- Gender: ${inp.gender}
- Current Weight: ${inp.weight} kg
- Height: ${inp.height} cm
- Activity Level: ${actDesc}
- Fitness Goal: ${goalTxt}
${inp.rate ? `- Target Weight Change: ${inp.rate} kg/week` : ''}

Calculated Metrics:
- BMI: ${metrics.bmi} (${bmiCat})
- BMR (Basal Metabolic Rate): ${metrics.bmr} kcal/day
- TDEE (Total Daily Energy Expenditure): ${metrics.tdee} kcal/day
- Body Fat Percentage: ${metrics.bodyFat}% (using ${metrics.bodyFatMethod})
- Lean Body Mass: ${metrics.lbmFromBf} kg

Personalized Nutrition Plan:
- Daily Calorie Target: ${metrics.dailyKcal} kcal
- Protein: ${metrics.protein}g (${metrics.proteinKcal} kcal)
- Fat: ${metrics.fat}g (${metrics.fatKcal} kcal)
- Carbohydrates: ${metrics.carbs}g (${metrics.carbsKcal} kcal)

Please provide advice tailored to this specific profile.`;
}

function buildCoachSystemPrompt(metrics, calculated) {
  const ctx = calculated ? buildAIContext(metrics) : 'No fitness data available.';
  return `You are a knowledgeable fitness coach and nutritionist. You are helping a user with their fitness journey.

${ctx}

IMPORTANT INSTRUCTIONS:
- **ONLY answer questions related to HUMAN fitness, health, nutrition, exercise, wellness, and related topics**
- **NOTE:** Questions about "hero health", "optimal health", "good health", "ideal fitness", or what healthy living looks like for HUMANS are fitness-related and should be answered
- If user asks about non-human health (pets, animals, plants) or clearly non-fitness topics (programming, general knowledge, entertainment, politics, etc.), politely decline and say: "I'm a fitness and health assistant. I can only help with questions about nutrition, workouts, wellness, and your fitness goals. Feel free to ask me anything related to your health and fitness journey!"
- Keep responses CONCISE (2-3 short paragraphs maximum, under 200 words)
- Use bullet points for lists (use * or - for bullets)
- Use ONE level of bullets only (no nested sub-bullets)
- Format as: intro text, then bullet list, then conclusion
- Be practical and actionable
- Avoid repetition
- Use simple language and avoid medical jargon

Provide helpful, personalized advice based on their fitness profile.`;
}

function buildFoodPrompt(dietary, allergies, userQuestion, metrics, disliked) {
  const allergyTxt = allergies === 'none' ? 'No allergies' : `Allergies: ${allergies}`;
  const foodCtx = buildFoodListContext(dietary, allergies, disliked);
  const goalTxt = metrics.input.goal === 'weight_loss' ? 'Weight Loss' : metrics.input.goal === 'weight_gain' ? 'Weight Gain' : 'Stay Healthy (Maintenance)';
  const pt = metrics.protein;
  const pMin = Math.round(pt * 0.95);
  const pMax = Math.round(pt * 1.05);
  let dislikedCtx = '';
  if (disliked.length) {
    dislikedCtx = '\n**FOODS USER DISLIKES (DO NOT INCLUDE):**\n' + disliked.map(f => `- ${f}`).join('\n') + '\n';
  }
  const ql = userQuestion.toLowerCase();
  const isFoodListQ = ql.includes('what') && (ql.includes('food') || ql.includes('eat')) && (ql.includes('protein') || ql.includes('hit'));
  const isSimpleQ = ql.includes('what food') || ql.includes('which food') || (ql.includes('what') && ql.includes('should i eat'));

  if (isFoodListQ || isSimpleQ) {
    return `You are a precision nutrition coach. Create a clean, practical protein distribution plan.

MY PROFILE:
- Dietary Preference: ${getDietaryLabel(dietary)}
- ${allergyTxt}
- **PROTEIN TARGET: ${pt}g (acceptable range: ${pMin}g - ${pMax}g)**
${dislikedCtx}
${foodCtx}

**STRICT RULES - FOLLOW EXACTLY:**

1. **PRACTICAL SERVING SIZES ONLY:**
   - Yogurt/Skyr: Use 100g or 200g ONLY (comes in 100g packs)
   - Paneer: Use 100g, 150g, or 200g
   - Soya Chunks: Use 25g, 50g, 75g, or 100g (uncooked)
   - Protein Atta: Use 50g, 75g, or 100g
   - Tofu: Use 100g or 200g
   - Whey Protein: MAXIMUM 1 scoop (30g) - never more than 1 scoop
   - Dal/Legumes: Use 50g, 100g, or 150g (cooked weight)
   - Milk: Use 1 cup (240ml) or 2 cups (480ml)

2. **PROTEIN CALCULATION:**
   - Target range is ${pMin}g - ${pMax}g (±5% of ${pt}g)
   - Any total within this range is PERFECT
   - Do all calculations internally - show only the final plan
   - DO NOT show revision steps or corrections

3. **FOOD SELECTION:**
   - Pick 4-6 HIGH-PROTEIN foods from the AVAILABLE FOOD LIST
   - Prioritize foods with >15g protein per 100g
   - Include variety - no duplicates (don't list 2 yogurts or 2 types of paneer)

**OUTPUT FORMAT (follow exactly):**

**Protein Distribution Plan**
1. **[Food Name]** - [Quantity]
Protein: [X]g

2. **[Food Name]** - [Quantity]
Protein: [X]g

[continue for 4-6 foods with blank line between each item...]

**Total Protein: [X]g**

**IMPORTANT - DO NOT:**
- Show calculation formulas or steps
- Show "revised" or "corrected" versions
- Explain adjustments or reasoning
- Apologize for being slightly above/below target
- Show multiple plan versions
- Use odd serving sizes (like 70g, 120g, 250g for yogurt)

Show ONE clean, final plan only. Keep response under 200 words.`;
  }

  return `Based on my question about food/meals, create a detailed daily meal plan.

MY PROFILE:
- Dietary Preference: ${getDietaryLabel(dietary)}
- ${allergyTxt}
- Fitness Goal: ${goalTxt}
- Daily Calorie Target: ${metrics.dailyKcal} kcal
- Daily Macro Targets:
  * Protein: ${metrics.protein}g
  * Fat: ${metrics.fat}g
  * Carbohydrates: ${metrics.carbs}g
${dislikedCtx}
${foodCtx}

INSTRUCTIONS:
1. **DO NOT include any foods from the DISLIKES list**
2. **PRIORITIZE foods from the Available Food List above** - these have verified nutrition data
3. Create a FULL DAY meal plan divided into: Breakfast, Lunch, Dinner, and Snacks (if needed)
4. Specify EXACT quantities for each food item using practical serving sizes:
   - Yogurt/Skyr: 100g or 200g only
   - Paneer: 100g, 150g, or 200g
   - Whey Protein: Maximum 1 scoop (30g)
5. Calculate and show macros for each meal in format: (Xg protein, Yg carbs, Zg fat, Z kcal)
6. **MACRO REQUIREMENTS:**
   - **PROTEIN**: Within ±5% of target (${pMin}g - ${pMax}g)
   - **FAT**: Must NOT exceed ${metrics.fat}g
   - **CARBS**: Must NOT exceed ${metrics.carbs}g
   - **CALORIES**: Must NOT exceed ${metrics.dailyKcal} kcal
7. DO NOT include any product links or URLs
8. You may suggest common Indian foods if needed to meet macro targets

FORMAT:
**Breakfast** (Xg protein, Xg carbs, Xg fat, X kcal)
- [Food item with quantity and macros]

Keep response concise. Show total macros at the end.`;
}

// --------- Coach screen ---------
function CoachScreen({ metrics, calculated }) {
  const [messages, setMessages] = useState(() => [
    { role: "assistant", text: calculated
      ? `Hi — I've got your numbers loaded (TDEE ${metrics.tdee.toLocaleString()} kcal, target ${metrics.dailyKcal.toLocaleString()} kcal, ${metrics.protein}g protein). Ask me anything about hitting them.`
      : "Hi — fill in the calculator first and I'll have your numbers loaded for tailored advice. Or ask a general question." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(null);
  const [dietaryPref, setDietaryPref] = useState(null);
  const [userAllergies, setUserAllergies] = useState(null);
  const [dislikedFoods, setDislikedFoods] = useState([]);
  const [originalQuestion, setOriginalQuestion] = useState("");
  const convHistory = useRef([]);
  const scroller = useRef(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, busy]);

  const callCoach = useCallback(async (apiMessages, displayMsgs) => {
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      const reply = data.choices?.[0]?.message?.content;
      convHistory.current.push({ role: "assistant", content: reply });
      if (convHistory.current.length > 20) convHistory.current = convHistory.current.slice(-20);
      setMessages([...displayMsgs, { role: "assistant", text: reply || "I couldn't draft a response. Try rephrasing." }]);
    } catch (e) {
      setMessages([...displayMsgs, { role: "assistant", text: "I'm offline right now. Try the suggestions on the right." }]);
    } finally {
      setBusy(false);
    }
  }, []);

  const handleDietaryChoice = useCallback((choice) => {
    const label = getDietaryLabel(choice);
    setDietaryPref(choice);
    setAwaitingResponse("allergies");
    convHistory.current.push({ role: "user", content: label });
    const allergyQ = "Do you have any food allergies I should know about? (type 'none' if not)";
    convHistory.current.push({ role: "assistant", content: allergyQ });
    setMessages(prev => [
      ...prev,
      { role: "user", text: label },
      { role: "assistant", text: allergyQ },
    ]);
  }, []);

  const send = useCallback(async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || busy) return;
    if (!metrics) {
      setMessages(prev => [...prev, { role: "user", text }, { role: "assistant", text: "Please fill in the calculator first so I have your metrics to work with." }]);
      setInput("");
      return;
    }
    setInput("");

    // 0. Awaiting dietary choice via buttons — typed input only escapes via non-food topic
    if (awaitingResponse === "dietary_preference") {
      const nonFoodKws = ['workout', 'exercise', 'training', 'cardio', 'lift', 'gym', 'run'];
      if (!nonFoodKws.some(kw => text.toLowerCase().includes(kw))) return;
      setAwaitingResponse(null);
      setOriginalQuestion("");
    }

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    convHistory.current.push({ role: "user", content: text });
    setBusy(true);

    // 1. Food dislike detection (only if dietary pref already set)
    const dislikedFood = detectFoodDislike(text);
    if (dislikedFood && dietaryPref) {
      const newDisliked = dislikedFoods.includes(dislikedFood) ? dislikedFoods : [...dislikedFoods, dislikedFood];
      setDislikedFoods(newDisliked);
      const prompt = buildFoodPrompt(dietaryPref, userAllergies, "What foods should I eat to hit my protein goal?", metrics, newDisliked);
      const sysMsg = { role: "system", content: buildCoachSystemPrompt(metrics, calculated) };
      await callCoach([sysMsg, ...convHistory.current, { role: "user", content: prompt }], next);
      return;
    }

    // 2. Awaiting allergy response (typed into composer)
    if (awaitingResponse === "allergies") {
      const allergyVal = text.toLowerCase() === "none" ? "none" : text;
      setUserAllergies(allergyVal);
      setAwaitingResponse(null);
      const prompt = buildFoodPrompt(dietaryPref, allergyVal, originalQuestion, metrics, dislikedFoods);
      const sysMsg = { role: "system", content: buildCoachSystemPrompt(metrics, calculated) };
      await callCoach([sysMsg, ...convHistory.current, { role: "user", content: prompt }], next);
      return;
    }

    // 3. Food intent: no dietary pref yet → ask for it via choice buttons
    if (detectFoodIntent(text) && !dietaryPref) {
      setOriginalQuestion(text);
      setAwaitingResponse("dietary_preference");
      setMessages([...next, {
        role: "choices",
        text: "Before I recommend foods, what is your dietary preference?",
        choices: [
          { label: "🌱 Vegetarian", value: "veg" },
          { label: "🍖 Non-Vegetarian", value: "non-veg" },
          { label: "🥚 Egg + Veg", value: "egg-veg" },
          { label: "🌿 Vegan", value: "vegan" },
        ],
      }]);
      setBusy(false);
      return;
    }

    // 4. Food intent: dietary pref already known → build food prompt directly
    if (detectFoodIntent(text) && dietaryPref) {
      const prompt = buildFoodPrompt(dietaryPref, userAllergies, text, metrics, dislikedFoods);
      const sysMsg = { role: "system", content: buildCoachSystemPrompt(metrics, calculated) };
      await callCoach([sysMsg, ...convHistory.current, { role: "user", content: prompt }], next);
      return;
    }

    // 5. Normal conversation with full history + system prompt
    const sysMsg = { role: "system", content: buildCoachSystemPrompt(metrics, calculated) };
    await callCoach([sysMsg, ...convHistory.current], next);
  }, [input, busy, messages, awaitingResponse, dietaryPref, userAllergies, dislikedFoods, originalQuestion, metrics, calculated, callCoach]);

  const suggestions = [
    "What should breakfast look like?",
    "How do I split protein across the day?",
    "Cardio vs. lifting for my goal?",
    "Why is my body fat % what it is?",
    "What if I plateau?",
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow">04 · Coach</p>
        <h1 className="display" style={{ fontSize: 'clamp(36px,4.6vw,52px)', marginBottom: 8 }}>Ask your coach.</h1>
        <p className="lede">Your numbers are passed along automatically. Get a plan, debug a plateau, or sanity-check what you're eating.</p>
      </div>
      <div className="coach-shell">
        <div className="chat-pane">
          <div className="chat-head">
            <span className="name">FitHeal Coach</span>
            <span className="status">Online</span>
          </div>
          <div className="messages" ref={scroller}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === "choices" ? "assistant" : m.role}`}>
                <span className="role">{m.role === "user" ? "You" : "Coach"}</span>
                <div className="bubble">
                  {m.role === "user"
                    ? m.text
                    : <span dangerouslySetInnerHTML={{ __html: parseMarkdown(m.text) }} />}
                  {m.choices && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {m.choices.map((c) => (
                        <button key={c.value} onClick={() => handleDietaryChoice(c.value)}
                          style={{ appearance: 'none', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: 8, padding: '6px 12px', font: 'inherit', fontSize: 13, color: 'var(--primary-ink)', cursor: 'pointer' }}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && <div className="msg assistant"><span className="role">Coach</span><div className="bubble"><Dots /></div></div>}
          </div>
          {!busy && messages.length < 3 && (
            <div className="suggested">
              <div className="lbl">Try asking</div>
              {suggestions.slice(0, 3).map((s, i) => (
                <button key={i} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}
          <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={awaitingResponse === "allergies" ? "Type your allergies (e.g. nuts, dairy) or 'none'…" : "Ask about your plan…"} />
            <button type="submit" className="button primary" disabled={busy || !input.trim()}>
              <Icon d={ICONS.send} sz={14} />
              Send
            </button>
          </form>
        </div>
        <aside className="context-card">
          <h3 style={{ marginBottom: 14 }}>Your context</h3>
          {calculated ? (
            <>
              <div className="ctx-row"><span className="lbl">Goal</span><span className="vl">{goalLabel(metrics.input.goal)}</span></div>
              <div className="ctx-row"><span className="lbl">Daily kcal</span><span className="vl">{metrics.dailyKcal.toLocaleString()}</span></div>
              <div className="ctx-row"><span className="lbl">Protein</span><span className="vl">{metrics.protein}g</span></div>
              <div className="ctx-row"><span className="lbl">Carbs</span><span className="vl">{metrics.carbs}g</span></div>
              <div className="ctx-row"><span className="lbl">Fat</span><span className="vl">{metrics.fat}g</span></div>
              <div className="ctx-row"><span className="lbl">BMI</span><span className="vl">{metrics.bmi}</span></div>
              <div className="ctx-row"><span className="lbl">Body fat</span><span className="vl">{metrics.bodyFat}%</span></div>
            </>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>Calculate your metrics first to share them with the coach.</p>
          )}
          <h3 style={{ marginTop: 22, marginBottom: 8 }}>Prompts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{ appearance: 'none', textAlign: 'left', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 12px', font: 'inherit', fontSize: 12.5, color: 'var(--ink-2)', cursor: 'pointer' }}>{s}</button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: 'var(--ink-3)',
          animation: `dot 1.2s ${i * 0.15}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`@keyframes dot { 0%,80%,100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }`}</style>
    </span>
  );
}

function Footer() {
  return (
    <div className="disclaimer">
      <span className="copy">FitHeal · educational tool — not medical advice</span>
    </div>
  );
}

// --------- PDF report ---------
function downloadReport(m, weightUnit = "kg") {
  if (!window.html2pdf) { alert("Report generator still loading. Try again in a moment."); return; }

  const node = document.createElement("div");
  node.innerHTML = renderReportHTML(m, weightUnit);
  // position:absolute so html2canvas captures full height without viewport clipping
  node.style.cssText = "position:absolute;top:0;left:0;z-index:99999;width:794px;background:#fff;";
  document.body.appendChild(node);
  window.scrollTo(0, 0);

  setTimeout(() => {
    const h = node.scrollHeight;
    const opts = {
      margin: 0,
      filename: `FitHeal-report-${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.96 },
      html2canvas: {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        height: h,
        windowHeight: h,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    window.html2pdf().set(opts).from(node).save()
      .then(() => { if (node.parentNode) document.body.removeChild(node); })
      .catch(() => { if (node.parentNode) document.body.removeChild(node); });
  }, 300);
}

function renderReportHTML(m, weightUnit = "kg") {
  const i = m.input;
  const u = unitLabel(weightUnit);
  const wt = (kg, d = 1) => fmtWeight(kg, weightUnit, d);
  const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const activityLabel = ({ 1.2: "Sedentary", 1.375: "Light", 1.55: "Moderate", 1.725: "Very Active", 1.9: "Extra Active" })[i.activity] || `×${i.activity}`;
  const goalText = { weight_loss: "Lose weight", weight_gain: "Gain weight", stay_healthy: "Maintain" }[i.goal] || "—";
  const adj = m.dailyKcal - m.tdee;
  const css = `
    .rpt { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1c1a14; background: #fff; padding: 48px 56px; }
    .rpt-mono { font-family: ui-monospace, 'JetBrains Mono', monospace; }
    .rpt h1 { font-size: 32px; letter-spacing: -0.03em; margin: 0 0 4px; font-weight: 600; }
    .rpt h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #837d6c; margin: 32px 0 12px; font-weight: 600; }
    .rpt .sub { color: #4a4639; font-size: 13px; }
    .rpt .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #e6e0d1; padding-bottom: 16px; }
    .rpt .header .meta { text-align: right; font-family: ui-monospace, monospace; font-size: 11px; color: #837d6c; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.6; }
    .rpt .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
    .rpt .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .rpt .card { border: 1px solid #e6e0d1; border-radius: 10px; padding: 14px 16px; }
    .rpt .card .lbl { font-family: ui-monospace, monospace; font-size: 9.5px; letter-spacing: 0.08em; color: #837d6c; text-transform: uppercase; }
    .rpt .card .val { font-family: ui-monospace, monospace; font-size: 26px; letter-spacing: -0.03em; font-weight: 600; margin-top: 4px; }
    .rpt .card .unit { font-size: 12px; color: #837d6c; margin-left: 4px; font-weight: 400; }
    .rpt .card .ext { font-size: 11px; color: #4a4639; margin-top: 2px; }
    .rpt table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .rpt th, .rpt td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #ece7d8; }
    .rpt th { font-family: ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #837d6c; font-weight: 600; }
    .rpt td.r { text-align: right; font-family: ui-monospace, monospace; }
    .rpt .pill { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; border: 1px solid currentColor; font-family: ui-monospace, monospace; }
    .rpt .ftr { margin-top: 36px; padding-top: 14px; border-top: 1px solid #e6e0d1; font-family: ui-monospace, monospace; font-size: 10px; color: #837d6c; letter-spacing: 0.04em; text-transform: uppercase; display: flex; justify-content: space-between; }
    .rpt .bar { height: 10px; background: #f4f1ea; border-radius: 99px; overflow: hidden; display: flex; margin-top: 10px; }
    .rpt .bar > span { display: block; }
  `;
  const macroTotal = m.proteinKcal + m.carbsKcal + m.fatKcal || 1;
  const pPct = (m.proteinKcal / macroTotal * 100).toFixed(1);
  const cPct = (m.carbsKcal / macroTotal * 100).toFixed(1);
  const fPct = (m.fatKcal / macroTotal * 100).toFixed(1);
  const wkDelta = wt((m.dailyKcal - m.tdee) * 7 / 7700, 2);
  const moDelta = wt((m.dailyKcal - m.tdee) * 30 / 7700, 2);
  return `
    <style>${css}</style>
    <div class="rpt">
      <div class="header">
        <div>
          <h1>FitHeal · Personal report</h1>
          <div class="sub">Personalized metrics, daily targets, and projection.</div>
        </div>
        <div class="meta">
          <div>${date}</div>
          <div>${i.gender} · ${i.age}y · ${wt(i.weight)}${u} / ${i.height}cm</div>
          <div>Activity: ${activityLabel}</div>
        </div>
      </div>

      <h2>Core metrics</h2>
      <div class="grid4">
        <div class="card"><div class="lbl">BMI</div><div class="val">${m.bmi.toFixed(1)}</div><div class="ext">${m.bmiCategory.name}</div></div>
        <div class="card"><div class="lbl">BMR</div><div class="val">${m.bmr.toLocaleString()}<span class="unit">kcal</span></div><div class="ext">At-rest energy</div></div>
        <div class="card"><div class="lbl">TDEE</div><div class="val">${m.tdee.toLocaleString()}<span class="unit">kcal</span></div><div class="ext">Maintenance need</div></div>
        <div class="card"><div class="lbl">Lean mass</div><div class="val">${wt(m.lbm)}<span class="unit">${u}</span></div><div class="ext">Boer formula</div></div>
      </div>

      <h2>Body composition</h2>
      <div class="grid4">
        <div class="card"><div class="lbl">Weight</div><div class="val">${wt(i.weight)}<span class="unit">${u}</span></div></div>
        <div class="card"><div class="lbl">Body fat</div><div class="val">${m.bodyFat.toFixed(1)}<span class="unit">%</span></div><div class="ext">${wt(m.bodyFatKg)} ${u} · ${m.bodyFatMethod}</div></div>
        <div class="card"><div class="lbl">Lean (BF method)</div><div class="val">${wt(m.lbmFromBf)}<span class="unit">${u}</span></div></div>
        <div class="card"><div class="lbl">Lean (Boer)</div><div class="val">${wt(m.lbm)}<span class="unit">${u}</span></div></div>
      </div>

      <h2>Daily target</h2>
      <div class="grid2">
        <div class="card">
          <div class="lbl">Goal</div>
          <div class="val" style="font-size:18px;">${goalText}${i.rate ? ` · ${wt(i.rate, 2)} ${u}/wk` : ""}</div>
        </div>
        <div class="card">
          <div class="lbl">Calories per day</div>
          <div class="val">${m.dailyKcal.toLocaleString()}<span class="unit">kcal</span></div>
          <div class="ext">TDEE ${m.tdee.toLocaleString()} kcal · ${adj === 0 ? "no adjustment" : (adj > 0 ? "+" : "") + adj.toLocaleString() + " kcal"}</div>
        </div>
      </div>

      <h2>Macronutrients</h2>
      <table>
        <thead><tr><th>Macro</th><th class="r" style="text-align:right;">Grams</th><th class="r" style="text-align:right;">Kcal</th><th class="r" style="text-align:right;">% of day</th></tr></thead>
        <tbody>
          <tr><td>Protein</td><td class="r">${m.protein} g</td><td class="r">${m.proteinKcal}</td><td class="r">${pPct}%</td></tr>
          <tr><td>Carbohydrates</td><td class="r">${m.carbs} g</td><td class="r">${m.carbsKcal}</td><td class="r">${cPct}%</td></tr>
          <tr><td>Fat</td><td class="r">${m.fat} g</td><td class="r">${m.fatKcal}</td><td class="r">${fPct}%</td></tr>
        </tbody>
      </table>
      <div class="bar">
        <span style="width:${pPct}%; background:#3d6b4f;"></span>
        <span style="width:${cPct}%; background:#d9a84b;"></span>
        <span style="width:${fPct}%; background:#4a4639;"></span>
      </div>

      <h2>Projection</h2>
      <table>
        <thead><tr><th>Window</th><th class="r" style="text-align:right;">Weight change</th><th class="r" style="text-align:right;">Net kcal</th></tr></thead>
        <tbody>
          <tr><td>1 week</td><td class="r">${wkDelta} ${u}</td><td class="r">${((m.dailyKcal - m.tdee) * 7).toLocaleString()}</td></tr>
          <tr><td>1 month</td><td class="r">${moDelta} ${u}</td><td class="r">${((m.dailyKcal - m.tdee) * 30).toLocaleString()}</td></tr>
          <tr><td>12 weeks</td><td class="r">${wt(((m.dailyKcal - m.tdee) * 7 * 12) / 7700, 1)} ${u}</td><td class="r">${((m.dailyKcal - m.tdee) * 84).toLocaleString()}</td></tr>
        </tbody>
      </table>

      <div class="ftr">
        <span>FitHeal · educational tool, not medical advice</span>
        <span>Generated ${date}</span>
      </div>
    </div>
  `;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
