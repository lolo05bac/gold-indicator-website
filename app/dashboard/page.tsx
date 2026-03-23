"use client";
import { useState, useEffect } from "react";

const API_URL = "https://gold-intelligence-backend-production.up.railway.app";

const G = "#D4A849";
const GD = "#A68532";
const BG = "#08090D";
const BG2 = "#0D0F14";
const CARD = "#12151C";
const BD = "#1A1D28";
const T1 = "#F0EDE6";
const T2 = "#8B8FA3";
const T3 = "#5A5E70";
const GR = "#34D399";
const RD = "#F87171";
const BL = "#60A5FA";
const OR = "#FB923C";

function Tag({ children, color = G }: { children: React.ReactNode; color?: string }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: color + "18", color }}>{children}</span>;
}

function BiasGauge({ score, size = 160 }: { score: number; size?: number }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { let raf: number; const s = performance.now(); const step = (now: number) => { const p = Math.min((now - s) / 1800, 1); setAnim((1 - Math.pow(1 - p, 4)) * score); if (p < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf); }, [score]);
  const r = size / 2 - 16, cx = size / 2, cy = size / 2 + 10, sw = Math.PI - Math.PI * (anim / 10), nx = cx + r * Math.cos(sw), ny = cy - r * Math.sin(sw);
  const ap = (s: number, e: number) => `M ${cx+r*Math.cos(s)} ${cy-r*Math.sin(s)} A ${r} ${r} 0 ${s-e>Math.PI?1:0} 1 ${cx+r*Math.cos(e)} ${cy-r*Math.sin(e)}`;
  const c = anim <= 3 ? RD : anim <= 6 ? G : GR;
  return (<svg width={size} height={size/2+36} viewBox={`0 0 ${size} ${size/2+36}`}><defs><linearGradient id="gg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={RD}/><stop offset="40%" stopColor={G}/><stop offset="100%" stopColor={GR}/></linearGradient><filter id="gl2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d={ap(Math.PI,0)} fill="none" stroke="#1E2230" strokeWidth="10" strokeLinecap="round"/><path d={ap(Math.PI,sw)} fill="none" stroke="url(#gg2)" strokeWidth="10" strokeLinecap="round"/><circle cx={nx} cy={ny} r="5" fill={c} filter="url(#gl2)"/><text x={cx} y={cy-6} textAnchor="middle" fill={T1} fontSize="28" fontWeight="700" fontFamily="'DM Sans',sans-serif">{anim.toFixed(1)}</text><text x={cx} y={cy+12} textAnchor="middle" fill={T2} fontSize="10">/ 10</text></svg>);
}

function DriverBar({ name, impact, bull }: { name: string; impact: number; bull: boolean }) {
  const [w, setW] = useState(0);
  const c = bull ? GR : RD;
  useEffect(() => { setTimeout(() => setW(impact), 300); }, [impact]);
  return <div style={{ marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: c, flexShrink: 0 }} /><span style={{ fontSize: 12, color: T1, flex: 1 }}>{name}</span><span style={{ fontSize: 11, color: c, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{impact}</span></div><div style={{ height: 4, background: "#1A1D28", borderRadius: 2, marginLeft: 14 }}><div style={{ width: `${w}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${c}66,${c})`, transition: "width 1s ease" }} /></div></div>;
}

interface Signal {
  signal_date: string;
  weekly_bias: number;
  weekly_move: string;
  weekly_probability: number;
  weekly_confidence: number;
  daily_bias: number;
  daily_move: string;
  regime: string;
  bullish_drivers: { name: string; impact: number }[];
  bearish_drivers: { name: string; impact: number }[];
}

export default function Dashboard() {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("weekly");
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchSignal = async () => {
    try {
      const res = await fetch(`${API_URL}/api/signal/latest`);
      const data = await res.json();
      setSignal(data);
      setLastUpdate(new Date().toLocaleTimeString());
      setError("");
    } catch (err) {
      setError("Failed to fetch signal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignal();
    const interval = setInterval(fetchSignal, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const Card = ({ children, style, highlight }: { children: React.ReactNode; style?: React.CSSProperties; highlight?: boolean }) => (
    <div style={{ background: highlight ? `linear-gradient(180deg, ${G}06, ${CARD})` : CARD, border: `1px solid ${highlight ? G + "33" : BD}`, borderRadius: 14, padding: 22, ...style }}>{children}</div>
  );

  const SL = ({ children }: { children: React.ReactNode }) => <div style={{ fontSize: 10, color: T3, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 14 }}>{children}</div>;

  if (loading) return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}><div style={{ textAlign: "center" }}><div style={{ width: 40, height: 40, borderRadius: 8, background: `linear-gradient(135deg,${GD},${G})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: BG, margin: "0 auto 16px" }}>Au</div><div style={{ color: G, fontSize: 14 }}>Loading signal data...</div></div></div>;

  if (!signal) return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", color: RD }}>Failed to load signal data. Please refresh.</div>;

  const wbc = signal.weekly_bias >= 7 ? GR : signal.weekly_bias <= 3 ? RD : G;
  const dbc = signal.daily_bias >= 7 ? GR : signal.daily_bias <= 3 ? RD : G;
  const wLabel = signal.weekly_bias >= 7 ? "Bullish" : signal.weekly_bias <= 3 ? "Bearish" : "Neutral";
  const dLabel = signal.daily_bias >= 7 ? "Bullish" : signal.daily_bias <= 4 ? "Bearish" : "Lean Bullish";

  const tabs = [
    { id: "weekly", label: "Weekly Outlook", icon: "◈" },
    { id: "drivers", label: "Drivers", icon: "◇" },
    { id: "performance", label: "Performance", icon: "▣" },
  ];

  return <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans',sans-serif", color: T1 }}>
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: `1px solid ${BD}`, background: BG + "E6", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${GD},${G})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: BG }}>Au</div>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Gold<span style={{ color: G }}>Indicator</span></span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>{tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === t.id ? G + "18" : "transparent", color: tab === t.id ? G : T2, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}><span style={{ marginRight: 4 }}>{t.icon}</span>{t.label}</button>)}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Tag color={GR}>LIVE</Tag>
        <Tag color={G}>PRO</Tag>
      </div>
    </nav>

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 28px 60px" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, color: T3, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: 4 }}>Signal Date: {signal.signal_date}</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T1, margin: 0 }}>Gold Intelligence Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 10, color: T3, padding: "4px 10px", borderRadius: 6, background: CARD, border: `1px solid ${BD}` }}>Enhanced Model v2 · 48 features</span>
          <span style={{ fontSize: 10, color: GR, padding: "4px 10px", borderRadius: 6, background: GR + "10", border: `1px solid ${GR}22` }}>Updated {lastUpdate}</span>
          <button onClick={fetchSignal} style={{ fontSize: 10, color: G, padding: "4px 10px", borderRadius: 6, background: G + "10", border: `1px solid ${G}22`, cursor: "pointer" }}>↻ Refresh</button>
        </div>
      </div>

      {/* WEEKLY TAB */}
      {tab === "weekly" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
          <Card highlight style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: G, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: 10 }}>Weekly Gold Bias</div>
            <BiasGauge score={signal.weekly_bias} size={170} />
            <Tag color={wbc}>{wLabel}</Tag>
            <div style={{ marginTop: 8 }}><Tag color={GR}>63% Backtest Accuracy</Tag></div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SL>Weekly Metrics</SL>
              {[
                { l: "Expected Move", v: signal.weekly_move, c: signal.weekly_move.startsWith("+") ? GR : RD },
                { l: "Up Probability", v: `${signal.weekly_probability}%`, c: BL },
                { l: "Confidence", v: `${signal.weekly_confidence}%`, c: G },
                { l: "Regime", v: signal.regime.split("/")[0].trim(), c: OR },
              ].map((m, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 3 ? `1px solid ${BD}` : "none" }}><span style={{ fontSize: 12, color: T2 }}>{m.l}</span><span style={{ fontSize: 15, fontWeight: 700, color: m.c, fontFamily: "'DM Mono',monospace" }}>{m.v}</span></div>)}
            </Card>
            <Card>
              <SL>Today&apos;s Daily Signal</SL>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <BiasGauge score={signal.daily_bias} size={90} />
                <div><div style={{ fontSize: 11, color: T3 }}>Daily Bias</div><Tag color={dbc}>{dLabel}</Tag></div>
              </div>
              {[{ l: "Daily Move", v: signal.daily_move }, { l: "Regime", v: signal.regime.split("/")[0].trim() }].map((m, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 1 ? `1px solid ${BD}` : "none" }}><span style={{ fontSize: 11, color: T3 }}>{m.l}</span><span style={{ fontSize: 12, color: T2, fontFamily: "'DM Mono',monospace" }}>{m.v}</span></div>)}
              <div style={{ marginTop: 8, padding: "6px 10px", background: G + "08", borderRadius: 6, fontSize: 10, color: T3, lineHeight: 1.5 }}>Daily signals refresh every 60 seconds. Use as intraday context alongside the weekly outlook.</div>
            </Card>
          </div>
        </div>

        <Card>
          <SL>Regime Analysis</SL>
          <div style={{ padding: "14px 18px", background: BG2, borderRadius: 10, border: `1px solid ${BD}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 8 }}>{signal.regime}</div>
            <p style={{ fontSize: 13, color: T2, lineHeight: 1.7, margin: 0 }}>The current market regime is characterized by elevated geopolitical risk and declining real yields. This combination historically supports gold through safe-haven demand and reduced opportunity cost of holding non-yielding assets. The model assigns higher weight to geopolitical and yield features in this regime.</p>
          </div>
        </Card>
      </div>}

      {/* DRIVERS TAB */}
      {tab === "drivers" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <SL>Gold Drivers — Ranked by Model Impact</SL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: GR }} /><span style={{ fontSize: 12, fontWeight: 600, color: GR }}>BULLISH DRIVERS</span></div>
              {signal.bullish_drivers.map((d, i) => <DriverBar key={i} name={d.name} impact={d.impact} bull={true} />)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: RD }} /><span style={{ fontSize: 12, fontWeight: 600, color: RD }}>BEARISH DRIVERS</span></div>
              {signal.bearish_drivers.map((d, i) => <DriverBar key={i} name={d.name} impact={d.impact} bull={false} />)}
            </div>
          </div>
        </Card>
        <Card>
          <SL>How to Read This</SL>
          <p style={{ fontSize: 13, color: T2, lineHeight: 1.7, margin: 0 }}>Each driver is ranked by its SHAP impact score — this measures how much that feature pushed the model&apos;s prediction up (bullish) or down (bearish) for this specific week. Higher scores mean stronger influence on the current bias. The drivers update as new data comes in throughout the trading day.</p>
        </Card>
      </div>}

      {/* PERFORMANCE TAB */}
      {tab === "performance" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { l: "Weekly Accuracy", v: "63.1%", s: "2Y walk-forward", c: GR },
            { l: "Daily Accuracy", v: "55.9%", s: "All days", c: G },
            { l: "Strong Agreement", v: "65%+", s: "Daily+Weekly align", c: GR },
            { l: "Sharpe Ratio", v: "2.02", s: "Signal-following", c: BL },
          ].map((m, i) => <Card key={i} style={{ textAlign: "center" as const }}><div style={{ fontSize: 10, color: T3, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>{m.l}</div><div style={{ fontSize: 26, fontWeight: 700, color: m.c, fontFamily: "'DM Mono',monospace" }}>{m.v}</div><div style={{ fontSize: 11, color: T2, marginTop: 4 }}>{m.s}</div></Card>)}
        </div>
        <Card>
          <SL>Top Features by Model Importance</SL>
          {[{ f: "VIX Change Z-Score", v: 95 }, { f: "Oil Return", v: 92 }, { f: "VIX x SPX Interaction", v: 87 }, { f: "2Y Yield Change", v: 86 }, { f: "EUR/USD Return", v: 85 }, { f: "DXY Return", v: 80 }, { f: "Real Yield Change", v: 75 }, { f: "RSI 14-day", v: 73 }, { f: "DXY x Real Yield", v: 70 }, { f: "MA 50 Slope", v: 67 }].map((x, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 11, color: T1 }}>{x.f}</span><span style={{ fontSize: 10, color: T3 }}>{x.v}</span></div><div style={{ height: 4, background: "#1A1D28", borderRadius: 2 }}><div style={{ width: `${x.v}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${G}66,${G})` }} /></div></div>)}
        </Card>
        <Card>
          <SL>Methodology</SL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            {[{ n: "01", t: "Data", d: "XAUUSD, DXY, VIX, SPX, yields, CPI/NFP/PCE, GDELT news" }, { n: "02", t: "Features", d: "48 signals with interactions and z-scores" }, { n: "03", t: "Models", d: "LightGBM, XGBoost, Random Forest, Logistic Regression ensemble" }, { n: "04", t: "Validation", d: "Walk-forward backtest, 500+ out-of-sample days" }].map((s, i) => <div key={i} style={{ padding: 16, background: BG2, borderRadius: 10, border: `1px solid ${BD}` }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: G + "20", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>{s.n}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T1, marginBottom: 6 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: T3, lineHeight: 1.6 }}>{s.d}</div>
            </div>)}
          </div>
        </Card>
      </div>}
    </div>
  </div>;
}
