"use client";
import { useState, useEffect, useRef } from "react";

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

function AnimNum({ target, suffix = "", decimals = 1, dur = 1600 }: { target: number; suffix?: string; decimals?: number; dur?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const step = (now: number) => { const p = Math.min((now - s) / dur, 1); setVal((1 - Math.pow(1 - p, 3)) * target); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, dur]);
  return <span ref={ref}>{decimals === 0 ? Math.round(val) : val.toFixed(decimals)}{suffix}</span>;
}

function Tag({ children, color = G }: { children: React.ReactNode; color?: string }) {
  return <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + "18", color }}>{children}</span>;
}

function WeeklyCard({ week, bias, move, actual, hit }: { week: string; bias: number; move: string; actual: string; hit: boolean }) {
  const bc = bias >= 7 ? GR : bias <= 3 ? RD : G;
  return <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
    <span style={{ fontSize: 11, color: T3, fontFamily: "'DM Mono',monospace", width: 80, flexShrink: 0 }}>{week}</span>
    <span style={{ fontSize: 20, fontWeight: 800, color: bc, fontFamily: "'DM Mono',monospace", width: 36 }}>{bias}</span>
    <Tag color={bias >= 5.5 ? GR : RD}>{bias >= 5.5 ? "BULL" : "BEAR"}</Tag>
    <span style={{ fontSize: 12, color: T2, fontFamily: "'DM Mono',monospace", width: 50, textAlign: "right" as const }}>{move}</span>
    <span style={{ fontSize: 12, color: actual.startsWith("+") ? GR : RD, fontFamily: "'DM Mono',monospace", fontWeight: 600, width: 50, textAlign: "right" as const }}>{actual}</span>
    <span style={{ fontSize: 16, color: hit ? GR : RD, width: 20, textAlign: "center" as const }}>{hit ? "✓" : "✗"}</span>
  </div>;
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const results = [
    { week: "Mar 10–14", bias: 7.4, move: "+1.5%", actual: "+1.9%", hit: true },
    { week: "Mar 3–7", bias: 6.1, move: "+0.6%", actual: "+0.8%", hit: true },
    { week: "Feb 24–28", bias: 4.2, move: "-0.4%", actual: "-1.1%", hit: true },
    { week: "Feb 17–21", bias: 7.9, move: "+1.9%", actual: "+2.3%", hit: true },
    { week: "Feb 10–14", bias: 5.8, move: "+0.3%", actual: "-0.2%", hit: false },
    { week: "Feb 3–7", bias: 8.2, move: "+2.1%", actual: "+1.7%", hit: true },
    { week: "Jan 27–31", bias: 3.5, move: "-0.8%", actual: "-0.5%", hit: true },
    { week: "Jan 20–24", bias: 6.7, move: "+0.9%", actual: "+1.1%", hit: true },
  ];

  const faqs = [
    { q: "What exactly do I get for $5/month?", a: "Every Sunday evening before markets open, you receive a full weekly gold outlook: bias score (1-10), expected move, confidence level, regime classification, ranked bullish/bearish drivers, day-by-day breakdown, event risk calendar, and a written analysis. Plus a daily supporting signal." },
    { q: "How is the 63% accuracy calculated?", a: "Walk-forward backtesting over 2+ years. The model is retrained every 3 months on an expanding window. Each test period only uses data available at that point in time - no future data leakage." },
    { q: "What data does the model use?", a: "48 features across 4 layers: price/momentum (RSI, MACD, volatility), yields/dollar (DXY, real yields, curve slope), macro surprises (CPI, NFP, PCE vs expectations), and risk/sentiment (VIX, oil, geopolitical tension, Fed hawkishness)." },
    { q: "Is this financial advice?", a: "No. Gold-Indicator.com is a macro intelligence tool providing probabilistic analysis. It is not financial advice. Always do your own research." },
    { q: "Why weekly and not daily?", a: "Daily gold direction is essentially a coin flip (~55%). Weekly direction captures real macro forces - yields, USD, geopolitics - that take days to express. Our weekly model achieves 63% vs ~55% daily." },
    { q: "Can I cancel anytime?", a: "Yes. One click from your dashboard. No lock-in. Full 14-day free trial to start." },
  ];

  return <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans',sans-serif", color: T1, opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}>
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: `1px solid ${BD}22`, position: "sticky", top: 0, zIndex: 100, background: BG + "DD", backdropFilter: "blur(16px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg,${GD},${G})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: BG }}>Au</div>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Gold<span style={{ color: G }}>Indicator</span></span>
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <a href="#results" style={{ color: T2, fontSize: 13, textDecoration: "none" }}>Results</a>
        <a href="#pricing" style={{ color: T2, fontSize: 13, textDecoration: "none" }}>Pricing</a>
        <a href="#faq" style={{ color: T2, fontSize: 13, textDecoration: "none" }}>FAQ</a>
        <button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: `linear-gradient(90deg,${GD},${G})`, color: BG, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Try Free</button>
      </div>
    </nav>

    <section style={{ textAlign: "center", padding: "100px 40px 80px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${G}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <Tag color={GR}>Weekly Gold Intelligence — $5/month</Tag>
      <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, maxWidth: 740, margin: "24px auto", letterSpacing: "-0.03em" }}>Know Where Gold Is Headed<br /><span style={{ color: G }}>Before the Week Starts.</span></h1>
      <p style={{ fontSize: 17, color: T2, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>Every Sunday evening, get a data-driven weekly gold bias score, expected move, confidence level, and the exact macro drivers — all for less than a coffee.</p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 56 }}>
        <button style={{ padding: "14px 36px", borderRadius: 10, border: "none", background: `linear-gradient(90deg,${GD},${G})`, color: BG, fontSize: 15, fontWeight: 700, cursor: "pointer" }} onClick={() => window.open("https://buy.stripe.com/3cI00kdrX7l6cKD6gb5Vu00")}>Start Free — $0 for 14 Days →</button>
        <a href="#results" style={{ padding: "14px 36px", borderRadius: 10, border: `1px solid ${BD}`, color: T2, fontSize: 15, fontWeight: 600, textDecoration: "none", display: "inline-block" }}>See Past Results ↓</a>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 48 }}>
        {[{ v: <AnimNum target={63.1} suffix="%" />, l: "Weekly Accuracy", s: "2Y walk-forward backtest" }, { v: <AnimNum target={2.0} suffix="x" />, l: "Sharpe Ratio", s: "Signal-following strategy" }, { v: <AnimNum target={500} suffix="+" decimals={0} />, l: "Days Backtested", s: "No data leakage" }, { v: "$5", l: "Per Month", s: "Cancel anytime" }].map((m, i) => <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: i === 3 ? G : GR, fontFamily: "'DM Mono',monospace" }}>{m.v}</div>
          <div style={{ fontSize: 11, color: T1, marginTop: 4, fontWeight: 600 }}>{m.l}</div>
          <div style={{ fontSize: 10, color: T3, marginTop: 2 }}>{m.s}</div>
        </div>)}
      </div>
    </section>

    <section style={{ padding: "80px 40px", background: BG2 }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: G, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10, fontWeight: 600 }}>What You Get Every Week</div>
          <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em" }}>Sunday Evening. Inbox. Done.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
          <div style={{ background: CARD, border: `1px solid ${G}33`, borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 10, color: G, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Weekly Gold Bias</div>
            <div style={{ fontSize: 11, color: T3, marginBottom: 16 }}>Mar 17 – Mar 21, 2026</div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: GR, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>7.8</div>
              <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>/ 10 — Bullish</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[{ l: "Move", v: "+1.8%", c: GR }, { l: "Prob", v: "71%", c: BL }, { l: "Conf", v: "High", c: GR }].map((m, i) => <div key={i} style={{ textAlign: "center", padding: "8px 0", background: BG, borderRadius: 8 }}><div style={{ fontSize: 9, color: T3, textTransform: "uppercase", marginBottom: 2 }}>{m.l}</div><div style={{ fontSize: 14, fontWeight: 700, color: m.c, fontFamily: "'DM Mono',monospace" }}>{m.v}</div></div>)}
            </div>
            <div style={{ fontSize: 10, color: G, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Top Drivers</div>
            {[{ t: "ME tensions sustaining safe-haven bid", b: true }, { t: "Real yields declining 8bps this week", b: true }, { t: "DXY weakening toward 99.0", b: true }, { t: "Weekly RSI overbought — reversion risk", b: false }].map((d, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: d.b ? GR : RD, flexShrink: 0 }} /><span style={{ fontSize: 11, color: T2 }}>{d.t}</span></div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" }}>
            {[{ icon: "◈", title: "Weekly Bias Score 1–10", desc: "Clear direction score with probability and confidence. Published every Sunday." }, { icon: "↕", title: "Expected Weekly Move", desc: "How much gold is expected to move — positive or negative, with magnitude." }, { icon: "◇", title: "Regime Detection", desc: "Is this a geopolitical week? USD-driven? Yield-driven? Know what is driving gold." }, { icon: "▣", title: "Ranked Driver Analysis", desc: "Every bullish and bearish factor ranked by impact. Know WHY the model leans a certain way." }, { icon: "◆", title: "Day-by-Day Breakdown", desc: "Daily bias for each day of the week, with event risk flags for CPI, FOMC, NFP." }, { icon: "⚡", title: "Event Risk Calendar", desc: "Fed decisions, CPI, jobs reports — mapped with expected gold impact." }].map((f, i) => <div key={i} style={{ padding: 20, background: BG, borderRadius: 12, border: `1px solid ${BD}` }}><div style={{ fontSize: 18, color: G, marginBottom: 8 }}>{f.icon}</div><div style={{ fontSize: 14, fontWeight: 700, color: T1, marginBottom: 6 }}>{f.title}</div><div style={{ fontSize: 12, color: T3, lineHeight: 1.6 }}>{f.desc}</div></div>)}
          </div>
        </div>
      </div>
    </section>

    <section id="results" style={{ padding: "80px 40px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: G, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10, fontWeight: 600 }}>Real Results</div>
          <h2 style={{ fontSize: 34, fontWeight: 900 }}>63% Weekly Accuracy. Verified.</h2>
          <p style={{ fontSize: 15, color: T2, maxWidth: 560, margin: "12px auto 0", lineHeight: 1.7 }}>Walk-forward backtested over 500+ trading days. No future data leakage.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
          {results.map((w, i) => <WeeklyCard key={i} {...w} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[{ l: "Weekly Direction Accuracy", v: "63.1%", s: "2-year out-of-sample", c: GR }, { l: "Models Strongly Agree", v: "65%+", s: "Daily + weekly aligned", c: GR }, { l: "Sharpe Ratio", v: "2.02", s: "Risk-adjusted returns", c: BL }].map((m, i) => <div key={i} style={{ textAlign: "center", padding: 24, background: CARD, borderRadius: 14, border: `1px solid ${BD}` }}><div style={{ fontSize: 28, fontWeight: 800, color: m.c, fontFamily: "'DM Mono',monospace" }}>{m.v}</div><div style={{ fontSize: 12, color: T1, marginTop: 6, fontWeight: 600 }}>{m.l}</div><div style={{ fontSize: 10, color: T3, marginTop: 4 }}>{m.s}</div></div>)}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}><p style={{ fontSize: 11, color: T3, fontStyle: "italic" }}>Past performance does not guarantee future results. Not financial advice.</p></div>
      </div>
    </section>

    <section id="pricing" style={{ padding: "80px 40px", background: BG2 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: G, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10, fontWeight: 600 }}>Simple Pricing</div>
          <h2 style={{ fontSize: 34, fontWeight: 900 }}>Institutional Intelligence.<br /><span style={{ color: G }}>Coffee-Shop Price.</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T2, marginBottom: 4 }}>Free</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: T1, fontFamily: "'DM Mono',monospace", marginBottom: 24 }}>$0</div>
            {[{ t: "Last week's bias (delayed)", ok: true }, { t: "Basic regime label", ok: true }, { t: "3-week archive", ok: true }, { t: "Live weekly outlook", ok: false }, { t: "Driver breakdown", ok: false }, { t: "Event calendar", ok: false }].map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ color: f.ok ? GR : T3 + "44", fontSize: 12 }}>{f.ok ? "✓" : "—"}</span><span style={{ fontSize: 13, color: f.ok ? T2 : T3 + "66" }}>{f.t}</span></div>)}
            <button style={{ width: "100%", marginTop: 20, padding: "12px 0", borderRadius: 10, border: `1px solid ${BD}`, background: "transparent", color: T2, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Get Started Free</button>
          </div>
          <div style={{ background: `linear-gradient(180deg, ${G}0A, ${CARD})`, border: `1px solid ${G}44`, borderRadius: 16, padding: 32, position: "relative", boxShadow: `0 8px 40px ${G}12` }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 18px", borderRadius: 20, background: `linear-gradient(90deg,${GD},${G})`, fontSize: 10, fontWeight: 700, color: BG, textTransform: "uppercase" }}>Best Value</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: G, marginBottom: 4 }}>Pro</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}><span style={{ fontSize: 40, fontWeight: 800, color: T1, fontFamily: "'DM Mono',monospace" }}>$5</span><span style={{ fontSize: 14, color: T3 }}>/month</span></div>
            <div style={{ fontSize: 12, color: GR, marginBottom: 24 }}>14-day free trial · Cancel anytime</div>
            {["Live weekly bias + expected move", "Full ranked driver breakdown", "Regime detection", "Day-by-day outlook", "Event risk calendar", "Daily supporting signal", "Full signal archive"].map((t, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ color: GR, fontSize: 12 }}>✓</span><span style={{ fontSize: 13, color: T2 }}>{t}</span></div>)}
            <button style={{ width: "100%", marginTop: 20, padding: "14px 0", borderRadius: 10, border: "none", background: `linear-gradient(90deg,${GD},${G})`, color: BG, fontSize: 14, fontWeight: 700, cursor: "pointer" }} onClick={() => window.open("https://buy.stripe.com/3cI00kdrX7l6cKD6gb5Vu00")}>Start 14-Day Free Trial →</button>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: T3 }}>That is less than <span style={{ color: G, fontWeight: 600 }}>$0.17 per day</span> for institutional-grade gold intelligence.</div>
      </div>
    </section>

    <section id="faq" style={{ padding: "80px 40px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}><h2 style={{ fontSize: 34, fontWeight: 900 }}>Questions</h2></div>
        {faqs.map((faq, i) => <div key={i} style={{ marginBottom: 8 }}>
          <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", padding: "16px 20px", background: CARD, border: `1px solid ${BD}`, borderRadius: faqOpen === i ? "12px 12px 0 0" : 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" as const }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T1 }}>{faq.q}</span>
            <span style={{ fontSize: 18, color: G, transform: faqOpen === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
          </button>
          {faqOpen === i && <div style={{ padding: "16px 20px", background: CARD, border: `1px solid ${BD}`, borderTop: "none", borderRadius: "0 0 12px 12px", fontSize: 13, color: T2, lineHeight: 1.7 }}>{faq.a}</div>}
        </div>)}
      </div>
    </section>

    <section style={{ padding: "80px 40px", background: BG2, textAlign: "center" }}>
      <h2 style={{ fontSize: 38, fontWeight: 900, marginBottom: 16 }}>Stop Trading Gold Blind.<br /><span style={{ color: G }}>Start at $5/month.</span></h2>
      <p style={{ fontSize: 15, color: T2, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>14-day free trial. Cancel anytime. Get your first weekly outlook this Sunday.</p>
      <button style={{ padding: "16px 44px", borderRadius: 12, border: "none", background: `linear-gradient(90deg,${GD},${G})`, color: BG, fontSize: 16, fontWeight: 700, cursor: "pointer" }} onClick={() => window.open("https://buy.stripe.com/3cI00kdrX7l6cKD6gb5Vu00")}>Start Your Free Trial →</button>
    </section>

    <footer style={{ padding: "32px 40px", borderTop: `1px solid ${BD}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: `linear-gradient(135deg,${GD},${G})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: BG }}>Au</div>
        <span style={{ fontSize: 12, color: T3 }}>Gold-Indicator.com</span>
      </div>
      <div style={{ fontSize: 10, color: T3, maxWidth: 500, textAlign: "right" as const }}>© 2026 Gold Indicator. Not financial advice. Past performance does not guarantee future results.</div>
    </footer>
  </div>;
}
