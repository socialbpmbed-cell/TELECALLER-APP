"use client";

import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION — Point to our local API proxy
// ═══════════════════════════════════════════════════════════════
const WEBHOOK_URL = "/api/lead";

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const T = {
  bg: "#0C0E12",
  surface: "#14171E",
  card: "#1A1E27",
  border: "#262B36",
  text: "#E8E6E1",
  textMuted: "#8A8D96",
  textDim: "#565960",
  accent: "#D4A853",
  accentDim: "#B8922E",
  accentBg: "rgba(212,168,83,0.08)",
  accentBorder: "rgba(212,168,83,0.2)",
  open: "#D4A853",
  openBg: "rgba(212,168,83,0.12)",
  closed: "#4ADE80",
  closedBg: "rgba(74,222,128,0.1)",
  dead: "#F87171",
  deadBg: "rgba(248,113,113,0.1)",
  blue: "#60A5FA",
  green: "#4ADE80",
  purple: "#A78BFA",
  font: "'Outfit', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  radius: "10px",
  radiusLg: "14px",
};

const statusMap = {
  Open: { color: T.open, bg: T.openBg, label: "OPEN" },
  Closed: { color: T.closed, bg: T.closedBg, label: "CLOSED" },
  Dead: { color: T.dead, bg: T.deadBg, label: "DEAD" },
};

// SVG Icons
const Icon = {
  Search: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Phone: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  Message: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Building: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/></svg>,
  Clock: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Calendar: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Chart: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Check: ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  X: ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Minus: ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8A8D96" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Off: ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2.5" strokeLinecap="round"><path d="M18.36 6.64A9 9 0 0120.77 15"/><path d="M6.16 6.16a9 9 0 000 12.69"/><line x1="12" y1="2" x2="12" y2="6"/></svg>,
};

const methodConfig = {
  Phone: { Ic: Icon.Phone, color: T.blue, label: "Phone" },
  WhatsApp: { Ic: Icon.Message, color: T.green, label: "WhatsApp" },
  Visit: { Ic: Icon.Building, color: T.purple, label: "Visit" },
};
const pickupConfig = {
  Yes: { Ic: Icon.Check, label: "Picked up" },
  No: { Ic: Icon.X, label: "Not picked up" },
  "Switched Off": { Ic: Icon.Off, label: "Switched off" },
  "Not Reachable": { Ic: Icon.Off, label: "Not reachable" },
  "N/A": { Ic: Icon.Minus, label: "N/A" },
};

// ═══════════════════════════════════════════════════════════════
function Badge({ children, color, bg, style = {} }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 1, color, background: bg, fontFamily: T.font, ...style }}>{children}</span>;
}

function StatTile({ Ic, value, label, color }) {
  return (
    <div style={{ background: T.card, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: "14px 10px", textAlign: "center", flex: 1, minWidth: 95 }}>
      <div style={{ display: "flex", justifyContent: "center", color, opacity: 0.8 }}><Ic /></div>
      <div style={{ fontSize: 24, fontWeight: 800, color, margin: "6px 0 2px", fontFamily: T.font, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: T.textMuted, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: T.font }}>{label}</div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div style={{ background: T.bg, borderRadius: 8, padding: "8px 12px" }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: T.font }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 2, fontFamily: T.font }}>{value || "\u2014"}</div>
    </div>
  );
}

function TimelineEntry({ entry, isLast }) {
  const m = methodConfig[entry.method] || methodConfig.Phone;
  const pk = pickupConfig[entry.pickedUp] || pickupConfig["N/A"];
  const st = statusMap[entry.statusAfter] || statusMap.Open;
  const hasCb = !!entry.callbackScheduled;
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: isLast ? 0 : 14 }}>
      <div style={{ width: 28, minWidth: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", marginTop: 6, background: st.color, boxShadow: `0 0 8px ${st.color}40`, zIndex: 1 }} />
        {!isLast && <div style={{ width: 1, flex: 1, background: T.border, marginTop: 2 }} />}
      </div>
      <div style={{ flex: 1, background: T.bg, borderRadius: 8, padding: "10px 14px", border: hasCb ? `1px solid ${T.accentBorder}` : "1px solid transparent" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontSize: 11, color: T.textDim, fontWeight: 600, fontFamily: T.mono, letterSpacing: -0.3 }}>{entry.timestamp}</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: m.color, fontWeight: 600, fontFamily: T.font }}><m.Ic /> {entry.method}</span>
            <span title={pk.label} style={{ display: "inline-flex" }}><pk.Ic /></span>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: T.text, marginTop: 6, lineHeight: 1.55, fontFamily: T.font, fontWeight: 400 }}>{entry.notes}</div>
        <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
          {hasCb && <Badge color={T.accent} bg={T.accentBg} style={{ border: `1px solid ${T.accentBorder}` }}><Icon.Calendar /> CALLBACK {entry.callbackScheduled}</Badge>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true); setError(""); setResult(null); setFadeIn(false);
    try {
      const res = await fetch(`${WEBHOOK_URL}?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok && data.lead) { setResult(data); setTimeout(() => setFadeIn(true), 50); }
      else setError(data.error || "Lead not found.");
    } catch { setError("Could not connect to server. Check n8n is active."); }
    finally { setLoading(false); }
  };

  const r = result, lead = r?.lead;
  const status = lead ? (statusMap[lead.status] || statusMap.Open) : null;
  const cbDays = lead?.callbackDate ? Math.ceil((new Date(lead.callbackDate) - new Date()) / 864e5) : null;
  const cbCount = r ? (r.callLog || []).filter(e => e.callbackScheduled).length : 0;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text, padding: "20px 12px 40px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 780, margin: "0 auto 24px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, border: `1px solid ${T.accentBorder}`, background: T.accentBg, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.accent, marginBottom: 8 }}>PN DAS ACADEMY OF NURSING</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 2px", color: T.text, letterSpacing: -0.5 }}>Lead Intelligence</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Search any lead by ID or phone number</p>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto 24px", display: "flex", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: "0 14px" }}>
          <span style={{ marginRight: 8, opacity: 0.4, display: "inline-flex", color: T.textMuted }}><Icon.Search /></span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="PNDAS-001 or 9876543210" style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 14, fontFamily: T.mono, letterSpacing: 0.3 }} />
        </div>
        <button onClick={handleSearch} disabled={loading} style={{ padding: "0 24px", borderRadius: T.radius, border: "none", background: loading ? T.textDim : T.accent, color: T.bg, fontWeight: 700, fontSize: 13, cursor: loading ? "wait" : "pointer", fontFamily: T.font, letterSpacing: 0.5 }}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div style={{ maxWidth: 560, margin: "0 auto 20px", padding: "12px 16px", borderRadius: 8, background: T.deadBg, border: "1px solid rgba(248,113,113,0.2)", color: T.dead, fontSize: 13, textAlign: "center" }}>{error}</div>}

      {r && lead && (
        <div style={{ maxWidth: 780, margin: "0 auto", opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>

          {lead.callbackDate && cbDays !== null && cbDays >= 0 && (
            <div style={{ background: "linear-gradient(135deg, rgba(212,168,83,0.08), rgba(212,168,83,0.03))", borderRadius: T.radiusLg, padding: "14px 18px", marginBottom: 14, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ color: T.accent }}><Icon.Calendar size={28} /></div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.accent }}>{cbDays === 0 ? "CALLBACK DUE TODAY" : `Callback in ${cbDays} day${cbDays !== 1 ? "s" : ""}`}</div>
                <div style={{ fontSize: 12, color: T.accentDim, marginTop: 1 }}>Scheduled for {lead.callbackDate}</div>
              </div>
              <div style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 800, background: cbDays === 0 ? T.dead : T.accent, color: T.bg }}>{cbDays === 0 ? "TODAY" : `${cbDays}d`}</div>
            </div>
          )}

          <div style={{ background: T.card, borderRadius: T.radiusLg, padding: "20px 22px", marginBottom: 14, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{lead.name}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, fontFamily: T.mono }}>{lead.leadNo} &middot; {lead.phone}</div>
              </div>
              <Badge color={status.color} bg={status.bg}>{status.label}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginTop: 14 }}>
              <InfoField label="Address" value={lead.address} />
              <InfoField label="Course" value={lead.course} />
              <InfoField label="Lead Source" value={lead.source} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <StatTile Ic={Icon.Chart} value={r.totalFollowups || 0} label="Total" color={T.blue} />
            <StatTile Ic={Icon.Phone} value={r.followups?.phone?.count || 0} label="Phone" color={T.blue} />
            <StatTile Ic={Icon.Message} value={r.followups?.whatsapp?.count || 0} label="WhatsApp" color={T.green} />
            <StatTile Ic={Icon.Building} value={r.followups?.visit?.count || 0} label="Visits" color={T.purple} />
            <StatTile Ic={Icon.Clock} value={r.daysSinceLastContact >= 0 ? r.daysSinceLastContact : "?"} label="Days Since" color={r.daysSinceLastContact >= 7 ? T.dead : T.open} />
            <StatTile Ic={Icon.Calendar} value={cbCount} label="Callbacks" color={T.accent} />
          </div>

          {r.callLog?.length > 0 && (
            <div style={{ background: T.card, borderRadius: T.radiusLg, padding: "20px 18px", border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Interaction Timeline</h3>
                <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.mono }}>{r.callLog.length} entries</span>
              </div>
              {r.callLog.map((e, i) => <TimelineEntry key={i} entry={e} isLast={i === r.callLog.length - 1} />)}
            </div>
          )}

          {r.scheduledCallbacks?.length > 0 && (
            <div style={{ background: T.card, borderRadius: T.radiusLg, padding: "16px 18px", marginTop: 14, border: `1px solid ${T.accentBorder}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.accent, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}><Icon.Calendar /> Callback History</h3>
              {r.scheduledCallbacks.map((cb, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: i < r.scheduledCallbacks.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ minWidth: 70, fontSize: 11, fontWeight: 700, color: T.accent, fontFamily: T.mono }}>{cb.date}</div>
                  <div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>Set on {cb.setOn}</div>
                    <div style={{ fontSize: 12, color: T.text, marginTop: 2, lineHeight: 1.4 }}>{cb.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!r && !error && !loading && (
        <div style={{ maxWidth: 480, margin: "48px auto 0", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentBg, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: T.accent }}><Icon.Search size={26} /></div>
          <div style={{ color: T.textDim, fontSize: 14, lineHeight: 1.6 }}>
            Enter a Lead ID like{" "}
            <span style={{ color: T.accent, fontWeight: 600, cursor: "pointer", fontFamily: T.mono }} onClick={() => setQuery("PNDAS-001")}>PNDAS-001</span>
            {" "}or a phone number like{" "}
            <span style={{ color: T.accent, fontWeight: 600, cursor: "pointer", fontFamily: T.mono }} onClick={() => setQuery("9876543210")}>9876543210</span>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 780, margin: "32px auto 0", textAlign: "center", borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
        <span style={{ fontSize: 10, color: T.textDim, letterSpacing: 1 }}>BUILT BY RIGZZ TECHNOLOGY</span>
      </div>
    </div>
  );
}
