"use client";

import { useState, useEffect, useRef } from "react";

const API = {
  SEND_OTP: "/api/auth/otp/send",
  VERIFY_OTP: "/api/auth/otp/verify",
  FETCH_LEADS: "/api/leads/fetch",
  SUBMIT_UPDATE: "/api/leads/update",
};

const ALLOWED_EMAILS = [
  "telecaller1@pndas.com",
  "telecaller2@pndas.com",
  "telecaller3@pndas.com",
  "telecaller4@pndas.com",
  "ritam@rigzz.com",
  "ritamghosh195@gmail.com",
];

const C = {bg:"#F4F1EC",card:"#FFFFFF",border:"#DDD8CE",text:"#1A1714",sec:"#6B6560",dim:"#9C9690",accent:"#C8702A",abg:"#FFF4EB",abdr:"#F0D4B8",green:"#2D8A4E",gbg:"#E8F5EB",gbdr:"#B8DCC4",red:"#C0392B",rbg:"#FDECEB",rbdr:"#F0C4BF",amber:"#B8860B",ambg:"#FFF8E7",ambdr:"#E8D5A0",blue:"#2563EB",bbg:"#EFF6FF",font:"'DM Sans',sans-serif",mono:"'IBM Plex Mono',monospace"};

const Ic={
  Phone:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  Check:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Off:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18.36 6.64A9 9 0 0120.77 15"/><path d="M6.16 6.16a9 9 0 000 12.69"/><line x1="12" y1="2" x2="12" y2="6"/></svg>,
  Cal:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Send:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Arrow:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  User:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 7 12 13 2 7"/></svg>,
  Shield:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Lock:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Refresh:({s=18,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
};

function Btn({selected,onClick,children,color,bg,bdr}){return<button onClick={onClick} style={{flex:1,padding:"10px 6px",borderRadius:8,border:`2px solid ${selected?bdr||color:C.border}`,background:selected?bg:C.card,color:selected?color:C.sec,fontWeight:selected?700:500,fontSize:12,fontFamily:C.font,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,minHeight:44,WebkitTapHighlightColor:"transparent"}}>{children}</button>}

function LeadCard({lead,onSubmit,telecallerName}){
  const[pu,setPu]=useState(null);
  const[st,setSt]=useState(null);
  const[notes,setNotes]=useState("");
  const[cb,setCb]=useState("");
  const[selectedCourse,setSelectedCourse]=useState(lead.course||"");
  const[exp,setExp]=useState(false);
  const[done,setDone]=useState(false);
  const[busy,setBusy]=useState(false);
  const isCb=lead.pushReason?.includes("Callback");
  const noCourse=!lead.course;
  const canSub=pu&&st&&!busy;
  const phones=(lead.phone||"").split("/").map(p=>p.trim()).filter(Boolean);

  const submit=async()=>{
    if(!canSub)return;
    setBusy(true);
    await onSubmit({
      slNo: lead.slNo,
      name: lead.name,
      phone: lead.phone,
      pickedUp: pu,
      status: st,
      notes,
      callbackDate: cb || null,
      telecaller: telecallerName,
      course: selectedCourse,
    });
    setDone(true);
    setBusy(false);
  };

  if(done)return<div style={{background:C.gbg,borderRadius:12,padding:"20px",border:`1px solid ${C.gbdr}`,textAlign:"center",marginBottom:12}}><Ic.Check s={28} c={C.green}/><div style={{fontSize:14,fontWeight:700,color:C.green,fontFamily:C.font,marginTop:4}}>{lead.name} - Submitted</div><div style={{fontSize:12,color:C.sec,marginTop:2}}>{st}{cb?` | Callback: ${cb}`:""}</div></div>;

  return<div style={{background:C.card,borderRadius:12,marginBottom:12,border:`1px solid ${C.border}`,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
    <button onClick={()=>setExp(!exp)} style={{width:"100%",padding:"14px 16px",background:isCb?C.abg:C.card,border:"none",borderBottom:exp?`1px solid ${C.border}`:"none",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,WebkitTapHighlightColor:"transparent"}}>
      <div style={{width:36,height:36,borderRadius:"50%",background:isCb?C.abg:C.bbg,border:`1px solid ${isCb?C.abdr:"#BFDBFE"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic.User s={16} c={isCb?C.accent:C.blue}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font}}>{lead.name}</div>
        <div style={{fontSize:11,color:C.sec,fontFamily:C.mono,marginTop:1}}>
          #{lead.slNo} &middot; <span style={{color:noCourse?C.red:C.sec,fontWeight:noCourse?700:400}}>{lead.course||"NO COURSE"}</span> &middot; {lead.area}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
        <div style={{display:"flex",gap:4}}>
          {noCourse && <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:C.ambg,color:C.amber,border:`1px solid ${C.ambdr}`,letterSpacing:0.5}}>NO COURSE</span>}
          <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:isCb?C.abg:C.ambg,color:isCb?C.accent:C.amber,border:`1px solid ${isCb?C.abdr:C.ambdr}`,letterSpacing:0.5}}>{isCb?"CALLBACK":"STALE"}</span>
        </div>
        <div style={{transform:`rotate(${exp?90:0}deg)`,transition:"transform 0.2s",color:C.dim}}><Ic.Arrow s={14}/></div>
      </div>
    </button>

    {exp&&<div style={{padding:"14px 16px"}}>
      <div style={{background:C.bg,borderRadius:8,padding:"10px 12px",marginBottom:14,borderLeft:`3px solid ${C.border}`}}>
        <div style={{fontSize:9,fontWeight:700,color:C.dim,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Previous notes</div>
        <div style={{fontSize:12,color:C.sec,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{lead.remarks||"No previous notes"}</div>
      </div>

      {phones.map((num,i)=><a key={i} href={`tel:${num}`} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"12px",borderRadius:8,background:C.green,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:14,fontFamily:C.font,marginBottom:i<phones.length-1?8:14}}>
        <Ic.Phone s={18} c="#fff"/>Call {num}
      </a>)}

      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:C.text,letterSpacing:0.5,marginBottom:6}}>CALL PICKED UP?</div>
        <div style={{display:"flex",gap:6}}>
          <Btn selected={pu==="Yes"} onClick={()=>setPu("Yes")} color={C.green} bg={C.gbg} bdr={C.gbdr}><Ic.Check s={14} c={pu==="Yes"?C.green:C.dim}/>Yes</Btn>
          <Btn selected={pu==="No"} onClick={()=>setPu("No")} color={C.red} bg={C.rbg} bdr={C.rbdr}><Ic.X s={14} c={pu==="No"?C.red:C.dim}/>No</Btn>
          <Btn selected={pu==="Switched Off"} onClick={()=>setPu("Switched Off")} color={C.amber} bg={C.ambg} bdr={C.ambdr}><Ic.Off s={14} c={pu==="Switched Off"?C.amber:C.dim}/>Off</Btn>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.text, letterSpacing: 0.5, marginBottom: 6 }}>STATUS AFTER CALL</div>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn selected={st === "Open"} onClick={() => setSt("Open")} color={C.accent} bg={C.abg} bdr={C.abdr}>Open</Btn>
          <Btn selected={st === "Closed"} onClick={() => setSt("Closed")} color={C.green} bg={C.gbg} bdr={C.gbdr}>Closed</Btn>
          <Btn selected={st === "Dead"} onClick={() => setSt("Dead")} color={C.red} bg={C.rbg} bdr={C.rbdr}>Dead</Btn>
        </div>
      </div>

      {noCourse && (
        <div style={{ marginBottom: 14, padding: "12px", background: C.bbg, borderRadius: 10, border: `1px solid #BFDBFE` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.blue, letterSpacing: 0.5, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <Ic.Shield s={14} c={C.blue}/> SELECT COURSE <span style={{fontWeight:400,color:C.dim}}>(if known)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <Btn selected={selectedCourse === "BSC"} onClick={() => setSelectedCourse("BSC")} color={C.blue} bg="#fff" bdr={C.blue}>BSC Nursing</Btn>
            <Btn selected={selectedCourse === "GNM"} onClick={() => setSelectedCourse("GNM")} color={C.blue} bg="#fff" bdr={C.blue}>GNM</Btn>
            <Btn selected={selectedCourse === "ANM"} onClick={() => setSelectedCourse("ANM")} color={C.blue} bg="#fff" bdr={C.blue}>ANM</Btn>
            <Btn selected={selectedCourse === "P.B.Sc"} onClick={() => setSelectedCourse("P.B.Sc")} color={C.blue} bg="#fff" bdr={C.blue}>Post Basic</Btn>
          </div>
        </div>
      )}

      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:C.text,letterSpacing:0.5,marginBottom:6}}>CALL NOTES</div>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What happened on the call..." rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,fontFamily:C.font,fontSize:13,color:C.text,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
      </div>

      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:C.text,letterSpacing:0.5,marginBottom:6}}>CALLBACK DATE <span style={{fontWeight:400,color:C.dim}}>(optional)</span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Ic.Cal s={16} c={C.accent}/>
          <input type="date" value={cb} onChange={e=>setCb(e.target.value)} min={new Date(Date.now()+86400000).toISOString().split("T")[0]} style={{flex:1,padding:"10px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,fontFamily:C.mono,fontSize:13,color:C.text,outline:"none"}}/>
          {cb&&<button onClick={()=>setCb("")} style={{padding:"8px",borderRadius:6,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",display:"flex"}}><Ic.X s={14} c={C.dim}/></button>}
        </div>
      </div>

      <button onClick={submit} disabled={!canSub} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:canSub?C.accent:C.border,color:canSub?"#fff":C.dim,fontWeight:700,fontSize:14,fontFamily:C.font,cursor:canSub?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <Ic.Send s={16} c={canSub?"#fff":C.dim}/>{busy?"Submitting...":"Submit Update"}
      </button>
    </div>}
  </div>;
}

export default function App(){
  const[step,setStep]=useState("login");
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[otp,setOtp]=useState(["","","","","",""]);
  const[otpErr,setOtpErr]=useState("");
  const[authBusy,setAuthBusy]=useState(false);
  const[timer,setTimer]=useState(0);
  const refs=[useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];
  const[leads,setLeads]=useState([]);
  const[loading,setLoading]=useState(false);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [err, setErr] = useState("");

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const sendOtp = async () => {
    if (!name.trim() || !email.trim()) return;
    const em = email.trim().toLowerCase();
    if (!ALLOWED_EMAILS.includes(em)) {
      setOtpErr("This email is not authorized. Contact admin.");
      return;
    }
    setAuthBusy(true);
    setOtpErr("");
    try {
      const res = await fetch(API.SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, name: name.trim() }),
      });
      const data = await res.json();
      if (data.sent) {
        setStep("otp");
        setTimer(60);
        setTimeout(() => refs[0].current?.focus(), 100);
      } else setOtpErr(data.error || "Could not send OTP.");
    } catch {
      setOtpErr("Network error. Check connection.");
    } finally {
      setAuthBusy(false);
    }
  };

  const otpChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const nw = [...otp];
    nw[i] = v.slice(-1);
    setOtp(nw);
    setOtpErr("");
    if (v && i < 5) refs[i + 1].current?.focus();
    if (v && i === 5) {
      const full = [...nw.slice(0, 5), v.slice(-1)].join("");
      if (full.length === 6) setTimeout(() => verifyOtp(full), 200);
    }
  };
  const otpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs[i - 1].current?.focus();
    if (e.key === "Enter") {
      const f = otp.join("");
      if (f.length === 6) verifyOtp(f);
    }
  };

  const verifyOtp = async (code) => {
    setAuthBusy(true);
    setOtpErr("");
    try {
      const res = await fetch(API.VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: code,
          name: name.trim(),
        }),
      });
      const data = await res.json();
      if (data.verified) {
        setStep("app");
        setTimeout(fetchLeads, 100);
      } else {
        setOtpErr(data.error || "Invalid OTP.");
        setOtp(["", "", "", "", "", ""]);
        refs[0].current?.focus();
      }
    } catch {
      setOtpErr("Verification failed.");
    } finally {
      setAuthBusy(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(
        `${API.FETCH_LEADS}?name=${encodeURIComponent(name.trim())}`
      );
      const data = await res.json();
      setLeads(data.leads || []);
      setCompletedIds(new Set()); // Reset completed on refresh
    } catch {
      setErr("Could not fetch leads. Check if n8n is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (update) => {
    try {
      await fetch(API.SUBMIT_UPDATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      setCompletedIds((prev) => new Set(prev).add(update.slNo));
    } catch (e) {
      console.error("Submit error:", e);
    }
  };

  const logout = () => {
    setStep("login");
    setName("");
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setLeads([]);
    setCompletedIds(new Set());
    setErr("");
  };

  const pending = leads.length - completedIds.size;
  const today=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short",year:"numeric"});

  if(step==="login")return<div style={{minHeight:"100vh",background:C.bg,fontFamily:C.font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
    <div style={{width:56,height:56,borderRadius:"50%",background:C.abg,border:`1px solid ${C.abdr}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Ic.Shield s={24} c={C.accent}/></div>
    <h1 style={{fontSize:22,fontWeight:800,color:C.text,margin:"0 0 4px",textAlign:"center"}}>PN Das Telecaller</h1>
    <p style={{fontSize:13,color:C.sec,margin:"0 0 24px",textAlign:"center"}}>Sign in with your name and email</p>
    <div style={{width:"100%",maxWidth:320}}>
      <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:C.text,letterSpacing:0.5,display:"block",marginBottom:4}}>YOUR NAME</label><div style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"0 12px"}}><Ic.User s={16} c={C.dim}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" style={{flex:1,padding:"14px 0",background:"transparent",border:"none",outline:"none",fontSize:15,fontFamily:C.font,color:C.text}}/></div></div>
      <div style={{marginBottom:16}}><label style={{fontSize:11,fontWeight:700,color:C.text,letterSpacing:0.5,display:"block",marginBottom:4}}>EMAIL ADDRESS</label><div style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"0 12px"}}><Ic.Mail s={16} c={C.dim}/><input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendOtp()} type="email" placeholder="your@email.com" style={{flex:1,padding:"14px 0",background:"transparent",border:"none",outline:"none",fontSize:15,fontFamily:C.font,color:C.text}}/></div></div>
      {otpErr&&<div style={{padding:"10px 12px",borderRadius:8,background:C.rbg,border:`1px solid ${C.rbdr}`,color:C.red,fontSize:12,textAlign:"center",marginBottom:12}}>{otpErr}</div>}
      <button onClick={sendOtp} disabled={authBusy||!name.trim()||!email.trim()} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:name.trim()&&email.trim()?C.accent:C.border,color:name.trim()&&email.trim()?"#fff":C.dim,fontWeight:700,fontSize:14,fontFamily:C.font,cursor:name.trim()&&email.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Ic.Mail s={16} c={name.trim()&&email.trim()?"#fff":C.dim}/>{authBusy?"Sending OTP...":"Send OTP"}</button>
    </div>
  </div>;

  if(step==="otp")return<div style={{minHeight:"100vh",background:C.bg,fontFamily:C.font,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
    <div style={{width:56,height:56,borderRadius:"50%",background:C.gbg,border:`1px solid ${C.gbdr}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Ic.Lock s={24} c={C.green}/></div>
    <h2 style={{fontSize:20,fontWeight:800,color:C.text,margin:"0 0 4px",textAlign:"center"}}>Enter OTP</h2>
    <p style={{fontSize:13,color:C.sec,margin:"0 0 4px",textAlign:"center"}}>Sent to <span style={{fontWeight:700,color:C.text}}>{email}</span></p>
    <button onClick={()=>{setStep("login");setOtp(["","","","","",""]);setOtpErr("")}} style={{background:"none",border:"none",color:C.accent,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:C.font,marginBottom:24}}>Change email</button>
    <div style={{display:"flex",gap:8,marginBottom:16,maxWidth:300}}>
      {otp.map((d,i)=><input key={i} ref={refs[i]} type="tel" inputMode="numeric" maxLength={1} value={d} onChange={e=>otpChange(i,e.target.value)} onKeyDown={e=>otpKey(i,e)} onFocus={e=>e.target.select()} style={{width:44,height:52,textAlign:"center",fontSize:22,fontWeight:800,fontFamily:C.mono,color:C.text,background:d?C.card:C.bg,border:`2px solid ${d?C.accent:C.border}`,borderRadius:10,outline:"none"}}/>)}
    </div>
    {otpErr&&<div style={{padding:"10px 16px",borderRadius:8,background:C.rbg,border:`1px solid ${C.rbdr}`,color:C.red,fontSize:12,textAlign:"center",marginBottom:12,maxWidth:300,width:"100%"}}>{otpErr}</div>}
    {authBusy&&<div style={{fontSize:13,color:C.sec,marginBottom:12}}>Verifying...</div>}
    <div style={{fontSize:13,color:C.dim,textAlign:"center"}}>{timer>0?<span>Resend in <span style={{fontWeight:700,color:C.text,fontFamily:C.mono}}>{timer}s</span></span>:<button onClick={()=>{setOtp(["","","","","",""]);sendOtp()}} style={{background:"none",border:"none",color:C.accent,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:C.font,textDecoration:"underline"}}>Resend OTP</button>}</div>
  </div>;

  return<div style={{minHeight:"100vh",background:C.bg,fontFamily:C.font,padding:"0 0 24px"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
    <style>{`
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
    <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",position:"sticky",top:0,zIndex:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:14,fontWeight:700,color:C.text}}>Hi, {name}</div><div style={{fontSize:11,color:C.dim,fontFamily:C.mono}}>{today}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={fetchLeads} disabled={loading} style={{background:C.abg,border:`1px solid ${C.abdr}`,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:6,cursor:loading?"not-allowed":"pointer",color:C.accent,fontSize:12,fontWeight:700,fontFamily:C.font,transition:"all 0.2s"}}>
            <div style={{display:"flex",animation:loading?"spin 1s linear infinite":"none"}}><Ic.Refresh s={14} c={C.accent}/></div>
            {loading?"...":"Refresh"}
          </button>
          <button onClick={logout} style={{background:C.rbg,border:`1px solid ${C.rbdr}`,borderRadius:8,padding:"8px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.red,transition:"all 0.2s"}}>
            <Ic.Off s={18} c={C.red}/>
          </button>
          <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:800,color:pending>0?C.accent:C.green}}>{pending}</div><div style={{fontSize:9,fontWeight:700,color:C.dim,letterSpacing:1}}>PENDING</div></div>
        </div>
      </div>
      <div style={{marginTop:8,background:C.bg,borderRadius:4,height:4,overflow:"hidden"}}><div style={{width:`${leads.length>0?(completedIds.size/leads.length)*100:0}%`,height:"100%",background:C.green,borderRadius:4,transition:"width 0.3s ease"}}/></div>
    </div>

    <div style={{padding:"14px 12px"}}>
      {loading&&<div style={{textAlign:"center",padding:"40px 0",color:C.sec}}>Loading today's leads...</div>}
      {err&&<div style={{padding:"12px 16px",borderRadius:8,marginBottom:12,background:C.rbg,border:`1px solid ${C.rbdr}`,color:C.red,fontSize:13,textAlign:"center"}}>{err}</div>}
      {!loading&&leads.length===0&&!err&&<div style={{textAlign:"center",padding:"60px 20px"}}><Ic.Check s={40} c={C.green}/><div style={{fontSize:16,fontWeight:700,color:C.text,marginTop:8}}>No leads for today</div><div style={{fontSize:13,color:C.sec,marginTop:4}}>All caught up. Check back tomorrow.</div></div>}
      {!loading&&completedIds.size===leads.length&&leads.length>0&&<div style={{textAlign:"center",padding:"40px 20px",marginBottom:12,background:C.gbg,borderRadius:12,border:`1px solid ${C.gbdr}`}}><Ic.Check s={40} c={C.green}/><div style={{fontSize:18,fontWeight:800,color:C.green,marginTop:8}}>All Done!</div><div style={{fontSize:13,color:C.sec,marginTop:4}}>{leads.length} leads completed. Great work, {name}.</div></div>}
      {leads.map(l=><LeadCard key={l.slNo} lead={l} onSubmit={handleSubmit} telecallerName={name.trim()}/>)}
    </div>

    <div style={{textAlign:"center",padding:"16px",borderTop:`1px solid ${C.border}`,marginTop:8}}><span style={{fontSize:9,color:C.dim,letterSpacing:1}}>BUILT BY RIGZZ TECHNOLOGY</span></div>
  </div>;
}
