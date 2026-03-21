"use client";
import { useState, useEffect } from "react";

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
  return (<svg width={size} height={size/2+36} viewBox={`0 0 ${size} ${size/2+36}`}><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={RD}/><stop offset="40%" stopColor={G}/><stop offset="100%" stopColor={GR}/></linearGradient><filter id="gl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d={ap(Math.PI,0)} fill="none" stroke="#1E2230" strokeWidth="10" strokeLinecap="round"/><path d={ap(Math.PI,sw)} fill="none" stroke="url(#gg)" strokeWidth="10" strokeLinecap="round"/><circle cx={nx} cy={ny} r="5" fill={c} filter="url(#gl)"/><text x={cx} y={cy-6} textAnchor="middle" fill={T1} fontSize="28" fontWeight="700" fontFamily="'DM Sans',sans-serif">{anim.toFixed(1)}</text><text x={cx} y={cy+12} textAnchor="middle" fill={T2} fontSize="10">/ 10</text></svg>);
}

function DriverBar({ name, impact, detail, bull }: { name: string; impact: number; detail: string; bull: boolean }) {
  const [w, setW] = useState(0);
  const c = bull ? GR : RD;
  useEffect(() => { setTimeout(() => setW(impact), 300); }, [impact]);
  return <div style={{ marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: c, flexShrink: 0 }} /><span style={{ fontSize: 12, color: T1, flex: 1 }}>{name}</span><span style={{ fontSize: 11, color: T3, fontFamily: "'DM Mono',monospace" }}>{detail}</span></div><div style={{ height: 4, background: "#1A1D28", borderRadius: 2, marginLeft: 14 }}><div style={{ width: `${w}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${c}66,${c})`, transition: "width 1s ease" }} /></div></div>;
}

export default function Dashboard() {
  const [tab, setTab] = useState("weekly");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const weekly = { score: 7.8, move: "+1.8%", prob: 71, conf: 76, regime: "Geopolitical Risk-Bid / Falling Yields", period: "Mar 17 – Mar 21, 2026" };
  const daily = { score: 6.9, move: "+0.34%", prob: 62, conf: 58 };

  const bullDrivers = [
    { name: "Middle East escalation sustaining safe-haven flows", impact: 94, detail: "Tension score: 88" },
    { name: "Real yields declining — 10Y TIPS down 8bps this week", impact: 89, detail: "-8bps" },
    { name: "DXY weakening toward 99.0 support", impact: 82, detail: "DXY -0.21%" },
    { name: "Fed expected to hold — dovish tilt priced in", impact: 74, detail: "95.6% hold" },
    { name: "Oil above $100 feeding inflation narrative", impact: 68, detail: "WTI $102" },
  ];

  const bearDrivers = [
    { name: "Overbought on weekly RSI — mean reversion risk", impact: 45, detail: "RSI 68" },
    { name: "PPI release Thursday could surprise hawkish", impact: 38, detail: "Thu 08:30" },
    { name: "Equities stabilizing may reduce haven demand", impact: 29, detail: "SPX +0.3%" },
  ];

  const weekDays = [
    { day: "Mon 17", bias: 7.2, move: "+0.41%", event: "", conf: "Med" },
    { day: "Tue 18", bias: 7.5, move: "+0.38%", event: "PPI Release", conf: "Low" },
    { day: "Wed 19", bias: 8.1, move: "+0.52%", event: "FOMC Decision", conf: "High" },
    { day: "Thu 20", bias: 6.4, move: "+0.12%", event: "Jobless Claims", conf: "Med" },
    { day: "Fri 21", bias: 7.0, move: "+0.28%", event: "", conf: "Med" },
  ];

  const events = [
    { day: "Mon", time: "09:15", name: "Industrial Production", impact: "Low" },
    { day: "Tue", time: "08:30", name: "PPI Release", impact: "High" },
    { day: "Wed", time: "14:00", name: "FOMC Rate Decision", impact: "Very High" },
    { day: "Wed", time: "14:30", name: "Powell Press Conference", impact: "Very High" },
    { day: "Thu", time: "08:30", name: "Initial Jobless Claims", impact: "Medium" },
    { day: "Fri", time: "10:00", name: "Existing Home Sales", impact: "Low" },
  ];

  const recentWeekly = [
    { week: "Mar 10–14", bias: 7.4, predicted: "+1.5%", actual: "+1.9%", hit: true },
    { week: "Mar 3–7", bias: 6.1, predicted: "+0.6%", actual: "+0.8%", hit: true },
    { week: "Feb 24–28", bias: 4.2, predicted: "-0.4%", actual: "-1.1%", hit: true },
    { week: "Feb 17–21", bias: 7.9, predicted: "+1.9%", actual: "+2.3%", hit: true },
    { week: "Feb 10–14", bias: 5.8, predicted: "+0.3%", actual: "-0.2%", hit: false },
    { week: "Feb 3–7", bias: 8.2, predicted: "+2.1%", actual: "+1.7%", hit: true },
    { week: "Jan 27–31", bias: 3.5, predicted: "-0.8%", actual: "-0.5%", hit: true },
    { week: "Jan 20–24", bias: 6.7, predicted: "+0.9%", actual: "+1.1%", hit: true },
  ];

  const Card = ({ children, style, highlight }: { children: React.ReactNode; style?: React.CSSProperties; highlight?: boolean }) => (
    <div style={{ background: highlight ? `linear-gradient(180deg, ${G}06, ${CARD})` : CARD, border: `1px solid ${highlight ? G + "33" : BD}`, borderRadius: 14, padding: 22, ...style }}>{children}</div>
  );

  const SL = ({ children }: { children: React.ReactNode }) => <div style={{ fontSize: 10, color: T3, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 14 }}>{children}</div>;

  const tabs = [
    { id: "weekly", label: "Weekly Outlook", icon: "◈" },
    { id: "market", label: "Market Data", icon: "◇" },
    { id: "history", label: "Signal Archive", icon: "◆" },
    { id: "performance", label: "Performance", icon: "▣" },
  ];

  return <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans',sans-serif", color: T1, opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}>
    {/* Nav */}
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: `1px solid ${BD}`, background: BG + "E6", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${GD},${G})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: BG }}>Au</div>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Gold<span style={{ color: G }}>Indicator</span></span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>{tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === t.id ? G + "18" : "transparent", color: tab === t.id ? G : T2, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}><span style={{ marginRight: 4 }}>{t.icon}</span>{t.label}</button>)}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Tag color={GR}>LIVE</Tag><Tag color={G}>PRO</Tag></div>
    </nav>

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 28px 60px" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, color: T3, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: 4 }}>Week of March 17, 2026</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T1, margin: 0 }}>Gold Intelligence Dashboard</h1>
        </div>
        <span style={{ fontSize: 10, color: GR, padding: "4px 10px", borderRadius: 6, background: GR + "10", border: `1px solid ${GR}22` }}>Model v2 · 48 features · Updated 07:02 ET</span>
      </div>

      {/* ═══ WEEKLY TAB ═══ */}
      {tab === "weekly" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
          <Card highlight style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: G, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: 4 }}>Weekly Gold Bias</div>
            <div style={{ fontSize: 11, color: T3, marginBottom: 10 }}>{weekly.period}</div>
            <BiasGauge score={weekly.score} size={170} />
            <Tag color={GR}>Bullish</Tag>
            <div style={{ marginTop: 8 }}><Tag color={GR}>63% Backtest Accuracy</Tag></div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SL>Weekly Metrics</SL>
              {[{ l: "Expected Move", v: weekly.move, c: GR }, { l: "Up Probability", v: `${weekly.prob}%`, c: BL }, { l: "Confidence", v: `${weekly.conf}%`, c: G }, { l: "Regime", v: "Geo Risk-Bid", c: OR }].map((m, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 3 ? `1px solid ${BD}` : "none" }}><span style={{ fontSize: 12, color: T2 }}>{m.l}</span><span style={{ fontSize: 15, fontWeight: 700, color: m.c, fontFamily: "'DM Mono',monospace" }}>{m.v}</span></div>)}
            </Card>
            <Card>
              <SL>Today&apos;s Daily Signal</SL>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <BiasGauge score={daily.score} size={90} />
                <div><div style={{ fontSize: 11, color: T3 }}>Daily Bias</div><Tag color={G}>Lean Bullish</Tag></div>
              </div>
              {[{ l: "Move", v: daily.move }, { l: "Prob", v: `${daily.prob}%` }, { l: "Conf", v: `${daily.conf}%` }].map((m, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${BD}` : "none" }}><span style={{ fontSize: 11, color: T3 }}>{m.l}</span><span style={{ fontSize: 12, color: T2, fontFamily: "'DM Mono',monospace" }}>{m.v}</span></div>)}
              <div style={{ marginTop: 8, padding: "6px 10px", background: G + "08", borderRadius: 6, fontSize: 10, color: T3, lineHeight: 1.5 }}>Daily signals are noisier (~55%). Use as intraday context.</div>
            </Card>
          </div>
        </div>

        {/* Drivers */}
        <Card>
          <SL>This Week&apos;s Gold Drivers — Ranked by Model Impact</SL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: GR }} /><span style={{ fontSize: 12, fontWeight: 600, color: GR }}>BULLISH</span></div>
              {bullDrivers.map((d, i) => <DriverBar key={i} {...d} bull={true} />)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: RD }} /><span style={{ fontSize: 12, fontWeight: 600, color: RD }}>BEARISH</span></div>
              {bearDrivers.map((d, i) => <DriverBar key={i} {...d} bull={false} />)}
            </div>
          </div>
        </Card>

        {/* Day by day + Events */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <SL>Day-by-Day Breakdown</SL>
            {weekDays.map((d, i) => {
              const c = d.bias >= 7 ? GR : d.bias <= 4 ? RD : G;
              return <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${BD}` : "none" }}>
                <span style={{ fontSize: 11, color: G, fontFamily: "'DM Mono',monospace", width: 50 }}>{d.day}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'DM Mono',monospace", width: 32 }}>{d.bias}</span>
                <span style={{ fontSize: 12, color: d.move.startsWith("+") ? GR : RD, fontFamily: "'DM Mono',monospace", width: 52 }}>{d.move}</span>
                <Tag color={d.conf === "High" ? GR : d.conf === "Low" ? RD : T3}>{d.conf}</Tag>
                {d.event && <span style={{ fontSize: 10, color: OR, marginLeft: "auto" }}>{d.event}</span>}
              </div>;
            })}
          </Card>
          <Card>
            <SL>Key Events This Week</SL>
            {events.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < events.length - 1 ? `1px solid ${BD}` : "none" }}>
              <span style={{ fontSize: 10, color: G, fontFamily: "'DM Mono',monospace", width: 28 }}>{e.day}</span>
              <span style={{ fontSize: 10, color: T3, fontFamily: "'DM Mono',monospace", width: 40 }}>{e.time}</span>
              <span style={{ flex: 1, fontSize: 12, color: T1 }}>{e.name}</span>
              <Tag color={e.impact === "Very High" ? RD : e.impact === "High" ? OR : T3}>{e.impact}</Tag>
            </div>)}
            <div style={{ marginTop: 14, padding: "10px 12px", background: RD + "08", borderRadius: 8, border: `1px solid ${RD}18` }}>
              <span style={{ fontSize: 11, color: RD, fontWeight: 600 }}>FOMC week. </span>
              <span style={{ fontSize: 11, color: T2 }}>Wednesday rate decision + Powell presser is the biggest risk event.</span>
            </div>
          </Card>
        </div>

        {/* Narrative */}
        <Card>
          <SL>Weekly Analysis</SL>
          <p style={{ fontSize: 13, color: T2, lineHeight: 1.8, margin: 0 }}>Gold enters the week with strong geopolitical tailwinds from ongoing Middle East tensions and oil prices above $100. Real yields continue to decline as markets price in a more dovish Fed trajectory, with two rate cuts now expected by December 2026. The weekly model assigns a 71% probability of a positive week, with an expected move of +1.8%.</p>
          <p style={{ fontSize: 13, color: T2, lineHeight: 1.8, margin: "12px 0 0" }}>The key risk is Wednesday&apos;s FOMC decision. While a hold is near-certain (95.6% probability), Powell&apos;s language on inflation vs. growth risks will set the tone. A hawkish surprise could push gold below $5,000. A dovish tilt accelerates the rally toward $5,200.</p>
        </Card>
      </div>}

      {/* ═══ MARKET TAB ═══ */}
      {tab === "market" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
          {[{ name: "XAUUSD", price: "$5,026", change: "+0.14%", up: true }, { name: "DXY", price: "99.45", change: "-0.21%", up: false }, { name: "US 10Y Real", price: "1.42%", change: "-4.2bps", up: false }, { name: "VIX", price: "22.4", change: "+1.8", up: true }].map((m, i) => <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, color: T2, fontWeight: 600 }}>{m.name}</span><span style={{ fontSize: 11, color: m.up ? GR : RD, fontFamily: "'DM Mono',monospace" }}>{m.change}</span></div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T1, fontFamily: "'DM Mono',monospace" }}>{m.price}</div>
          </Card>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <SL>Sentiment Scores</SL>
            {[{ l: "Geopolitical Tension", v: 88, c: RD }, { l: "Safe-Haven Demand", v: 81, c: G }, { l: "Inflation Scare", v: 62, c: OR }, { l: "Fed Hawkishness", v: 35, c: BL }, { l: "Risk-Off Sentiment", v: 72, c: GR }].map((s, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 11, color: T2 }}>{s.l}</span><span style={{ fontSize: 11, color: s.c, fontFamily: "'DM Mono',monospace" }}>{s.v}</span></div><div style={{ height: 4, background: "#1A1D28", borderRadius: 2 }}><div style={{ width: `${s.v}%`, height: "100%", borderRadius: 2, background: s.c + "99" }} /></div></div>)}
          </Card>
          <Card>
            <SL>Cross-Asset Context</SL>
            {[{ pair: "Gold vs DXY", status: "DXY weakness supporting gold", signal: "Bullish" }, { pair: "Gold vs Real Yields", status: "Yields declining — positive for gold", signal: "Bullish" }, { pair: "Gold vs SPX", status: "Risk-off rotation into gold", signal: "Bullish" }, { pair: "Gold vs Oil", status: "Both rising — inflation hedge active", signal: "Neutral" }].map((x, i) => <div key={i} style={{ padding: "10px 0", borderBottom: i < 3 ? `1px solid ${BD}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 12, color: T1, fontWeight: 500 }}>{x.pair}</span><Tag color={x.signal === "Bullish" ? GR : G}>{x.signal}</Tag></div>
              <div style={{ fontSize: 11, color: T3 }}>{x.status}</div>
            </div>)}
          </Card>
        </div>
      </div>}

      {/* ═══ HISTORY TAB ═══ */}
      {tab === "history" && <Card>
        <SL>Weekly Signal Archive</SL>
        <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 12 }}>
          <thead><tr style={{ borderBottom: `1px solid ${BD}` }}>{["Week", "Bias", "Direction", "Predicted", "Actual", "Hit"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left" as const, color: T3, fontWeight: 500, fontSize: 10, textTransform: "uppercase" as const }}>{h}</th>)}</tr></thead>
          <tbody>{recentWeekly.map((w, i) => <tr key={i} style={{ borderBottom: `1px solid ${BD}` }}>
            <td style={{ padding: "10px 12px", color: T2, fontFamily: "'DM Mono',monospace" }}>{w.week}</td>
            <td style={{ padding: "10px 12px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontWeight: 700, background: w.bias >= 7 ? GR + "18" : w.bias <= 3 ? RD + "18" : G + "18", color: w.bias >= 7 ? GR : w.bias <= 3 ? RD : G, fontFamily: "'DM Mono',monospace" }}>{w.bias}</span></td>
            <td style={{ padding: "10px 12px" }}><Tag color={w.bias >= 5.5 ? GR : RD}>{w.bias >= 5.5 ? "BULL" : "BEAR"}</Tag></td>
            <td style={{ padding: "10px 12px", color: T1, fontFamily: "'DM Mono',monospace" }}>{w.predicted}</td>
            <td style={{ padding: "10px 12px", color: w.actual.startsWith("+") ? GR : RD, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{w.actual}</td>
            <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 16, color: w.hit ? GR : RD }}>{w.hit ? "✓" : "✗"}</span></td>
          </tr>)}</tbody>
        </table>
        <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
          <div style={{ padding: "12px 16px", background: GR + "08", borderRadius: 8, border: `1px solid ${GR}18` }}><span style={{ fontSize: 12, color: T2 }}>Weekly accuracy: </span><span style={{ fontSize: 16, fontWeight: 700, color: GR, fontFamily: "'DM Mono',monospace" }}>87.5%</span><span style={{ fontSize: 11, color: T3 }}> (7/8 recent)</span></div>
          <div style={{ padding: "12px 16px", background: G + "08", borderRadius: 8, border: `1px solid ${G}18` }}><span style={{ fontSize: 12, color: T2 }}>2Y backtest: </span><span style={{ fontSize: 16, fontWeight: 700, color: GR, fontFamily: "'DM Mono',monospace" }}>63.1%</span><span style={{ fontSize: 11, color: T3 }}> (walk-forward)</span></div>
        </div>
      </Card>}

      {/* ═══ PERFORMANCE TAB ═══ */}
      {tab === "performance" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[{ l: "Weekly Accuracy", v: "63.1%", s: "2Y walk-forward", c: GR }, { l: "Daily Accuracy", v: "55.9%", s: "All days", c: G }, { l: "Strong Agreement", v: "65%+", s: "Daily+Weekly align", c: GR }, { l: "Sharpe Ratio", v: "2.02", s: "Signal-following", c: BL }].map((m, i) => <Card key={i} style={{ textAlign: "center" as const }}><div style={{ fontSize: 10, color: T3, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>{m.l}</div><div style={{ fontSize: 26, fontWeight: 700, color: m.c, fontFamily: "'DM Mono',monospace" }}>{m.v}</div><div style={{ fontSize: 11, color: T2, marginTop: 4 }}>{m.s}</div></Card>)}
        </div>
        <Card>
          <SL>Top Features by Model Importance</SL>
          {[{ f: "VIX Change Z-Score", v: 95 }, { f: "Oil Return", v: 92 }, { f: "VIX x SPX Interaction", v: 87 }, { f: "2Y Yield Change", v: 86 }, { f: "EUR/USD Return", v: 85 }, { f: "DXY Return", v: 80 }, { f: "Real Yield Change", v: 75 }, { f: "RSI 14-day", v: 73 }, { f: "DXY x Real Yield", v: 70 }, { f: "MA 50 Slope", v: 67 }].map((x, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 11, color: T1 }}>{x.f}</span><span style={{ fontSize: 10, color: T3 }}>{x.v}</span></div><div style={{ height: 4, background: "#1A1D28", borderRadius: 2 }}><div style={{ width: `${x.v}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg,${G}66,${G})` }} /></div></div>)}
        </Card>
        <Card>
          <SL>Methodology</SL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            {[{ n: "01", t: "Data", d: "XAUUSD, DXY, VIX, SPX, yields, CPI/NFP/PCE, GDELT news sentiment" }, { n: "02", t: "Features", d: "48 signals: price, yields, macro surprises, sentiment, plus interactions and z-scores" }, { n: "03", t: "Models", d: "4-model ensemble: LightGBM, XGBoost, Random Forest, Logistic Regression" }, { n: "04", t: "Validation", d: "Walk-forward backtest, retrained quarterly, 500+ out-of-sample days" }].map((s, i) => <div key={i} style={{ padding: 16, background: BG2, borderRadius: 10, border: `1px solid ${BD}` }}>
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
