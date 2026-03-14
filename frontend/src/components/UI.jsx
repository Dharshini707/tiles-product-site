// ── Modal ──────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, width = 640 }) => {
  if (!open) return null
  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-box scale-in"
        style={{ width:"100%", maxWidth:width, borderRadius:16, padding:32 }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#D4A853" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#8A7A60", cursor:"pointer", fontSize:24 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── StatCard ───────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color = "#D4A853", delay = 0 }) => (
  <div className="stat-card card-hover fade-up"
    style={{ borderRadius:16, padding:24, animationDelay:`${delay}ms`, animationFillMode:"both" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <p style={{ fontSize:12, color:"#8A7A60", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>{label}</p>
        <p style={{ fontSize:28, fontWeight:700, color, fontFamily:"'Playfair Display',serif" }}>{value}</p>
        {sub && <p style={{ fontSize:12, color:"#6B5E4A", marginTop:4 }}>{sub}</p>}
      </div>
      <div style={{ width:48, height:48, borderRadius:12, background:"rgba(212,168,83,.12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#D4A853" }}>
        {icon}
      </div>
    </div>
  </div>
)

// ── StarRating ─────────────────────────────────────────────────────────────────
import { IcoStar } from './Icons.jsx'
const StarRating = ({ rating }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(s => <IcoStar key={s} filled={s <= Math.round(rating)} />)}
  </div>
)

export { Modal, StatCard, StarRating }
