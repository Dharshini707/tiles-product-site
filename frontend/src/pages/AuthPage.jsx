import { useState } from 'react'
import { IcoTile } from '../components/Icons.jsx'

const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", role:"Admin" })
  const [err,  setErr]  = useState("")

  const handle = () => {
    if (!form.email || !form.password) { setErr("Please fill all fields."); return }
    if (mode === "signup" && form.password !== form.confirm) { setErr("Passwords do not match."); return }
    onLogin({ name: form.name || "Admin User", email: form.email, role: form.role })
  }

  return (
    <div className="auth-bg" style={{ position:"relative", overflow:"hidden" }}>
      {/* Decorative bg tiles */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(212,168,83,.06) 0%, transparent 70%)", top:"10%", right:"-10%" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(200,150,94,.04) 0%, transparent 70%)", bottom:"10%", left:"-5%" }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position:"absolute", width:80, height:80, border:"1px solid rgba(212,168,83,.08)", borderRadius:8, left:`${15+i*15}%`, top:`${10+(i%3)*30}%`, transform:`rotate(${i*12}deg)` }} />
        ))}
      </div>

      <div style={{ display:"flex", width:"100%", maxWidth:960, borderRadius:24, overflow:"hidden", border:"1px solid #2A2418", boxShadow:"0 40px 80px rgba(0,0,0,.6)", position:"relative", zIndex:1 }}>
        {/* Left */}
        <div style={{ flex:1, background:"linear-gradient(145deg,#1A1814,#141210)", padding:"48px 40px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div className="float-anim" style={{ width:56, height:56, background:"linear-gradient(135deg,#D4A853,#C8965E)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
            <IcoTile size={28} color="#0F0E0C" />
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, marginBottom:8 }}>
            <span style={{ background:"linear-gradient(135deg,#D4A853,#F0C97A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>RoyalEdge</span>
            <br /><span style={{ color:"#E8DCC8" }}>Tiles</span>
          </h1>
          <p style={{ color:"#8A7A60", fontSize:14, lineHeight:1.7, marginBottom:32 }}>
            Premium tile management platform for wholesalers and retailers. Manage products, track sales, and grow your business.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {["Complete Product Catalog","Sales Analytics & Reports","Customer Management","Invoice Generation"].map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:10, color:"#C8B898", fontSize:13 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#D4A853", flexShrink:0 }} />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="auth-card" style={{ width:400, padding:"48px 40px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ display:"flex", gap:8, marginBottom:32, background:"#0F0E0C", padding:4, borderRadius:10 }}>
            {["login","signup"].map(m => (
              <button key={m} className={`tab-btn ${mode===m?"active":""}`} style={{ flex:1 }} onClick={() => { setMode(m); setErr("") }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#E8DCC8", marginBottom:6 }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ fontSize:13, color:"#6B5E4A", marginBottom:28 }}>
            {mode === "login" ? "Sign in to your dashboard" : "Join RoyalEdge Tiles platform"}
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {mode === "signup" && (
              <input className="input-royal" placeholder="Full Name" value={form.name}
                onChange={e => setForm({...form, name:e.target.value})}
                style={{ padding:"12px 16px", borderRadius:10, fontSize:14, width:"100%" }} />
            )}
            <input className="input-royal" placeholder="Email Address" type="email" value={form.email}
              onChange={e => setForm({...form, email:e.target.value})}
              style={{ padding:"12px 16px", borderRadius:10, fontSize:14, width:"100%" }} />
            <input className="input-royal" placeholder="Password" type="password" value={form.password}
              onChange={e => setForm({...form, password:e.target.value})}
              style={{ padding:"12px 16px", borderRadius:10, fontSize:14, width:"100%" }} />
            {mode === "signup" && (
              <>
                <input className="input-royal" placeholder="Confirm Password" type="password" value={form.confirm}
                  onChange={e => setForm({...form, confirm:e.target.value})}
                  style={{ padding:"12px 16px", borderRadius:10, fontSize:14, width:"100%" }} />
                <select className="input-royal" value={form.role} onChange={e => setForm({...form, role:e.target.value})}
                  style={{ padding:"12px 16px", borderRadius:10, fontSize:14, width:"100%", appearance:"none" }}>
                  <option>Admin</option><option>Sales Manager</option><option>Staff</option>
                </select>
              </>
            )}
            {err && <p style={{ color:"#EF4444", fontSize:13 }}>{err}</p>}
            <button className="btn-gold" onClick={handle} style={{ padding:"13px", borderRadius:10, fontSize:15, width:"100%" }}>
              {mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>
          {mode === "login" && (
            <p style={{ textAlign:"center", marginTop:20, fontSize:12, color:"#6B5E4A" }}>
              Demo: use any email & password
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
