import { useState } from 'react'
import { IcoTrash } from '../components/Icons.jsx'

const CartPage = ({ cart, setCart, setPage }) => {
  const [showPayment, setShowPayment] = useState(false)
  const [payMethod, setPayMethod]     = useState("UPI")
  const [formData, setFormData]       = useState({ name:"", phone:"", email:"", address:"" })
  const [ordered, setOrdered]         = useState(false)

  const updateQty = (id, type, delta) =>
    setCart(prev => prev.map(i => i.id===id && i.type===type ? {...i, qty:Math.max(1,i.qty+delta)} : i))
  const removeItem = (id, type) =>
    setCart(prev => prev.filter(i => !(i.id===id && i.type===type)))

  const subtotal = cart.reduce((a,i) => a + parseFloat(i.price)*i.qty, 0)
  const tax      = subtotal * 0.18
  const total    = subtotal + tax

  if (ordered) return (
    <div style={{ padding:24, display:"flex", alignItems:"center", justifyContent:"center", minHeight:400 }}>
      <div className="scale-in" style={{ textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#22C55E,#16A34A)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:36 }}>✓</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"#8B4513", marginBottom:8 }}>Order Placed!</h2>
        <p style={{ color:"#8A7A60", marginBottom:24 }}>Your order is confirmed. Total: ₹{total.toFixed(2)}</p>
        <button className="btn-gold" onClick={()=>{ setOrdered(false); setCart([]); setPage("dashboard") }}
          style={{ padding:"12px 28px", borderRadius:10, fontSize:14 }}>Back to Dashboard</button>
      </div>
    </div>
  )

  if (cart.length === 0) return (
    <div style={{ padding:24, display:"flex", alignItems:"center", justifyContent:"center", minHeight:400 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#8A7A60", marginBottom:12 }}>Your cart is empty</h2>
        <button className="btn-gold" onClick={()=>setPage("products")} style={{ padding:"10px 24px", borderRadius:10, fontSize:14 }}>Browse Products</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding:24 }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#000000", marginBottom:24 }}>Shopping Cart</h2>
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:24 }}>
        {/* Items */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {cart.map(item => (
            <div key={`${item.id}-${item.type}`} className="stat-card card-hover fade-up"
              style={{ borderRadius:16, padding:20, display:"flex", gap:16, alignItems:"center" }}>
              <img src={item.image} alt={item.name} style={{ width:80, height:80, objectFit:"cover", borderRadius:10, flexShrink:0 }}
                onError={e=>e.target.style.display="none"} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#000000", marginBottom:4 }}>{item.name}</h3>
                    <p style={{ fontSize:11, color:"#8A7A60", marginBottom:6 }}>{item.size} · {item.material}</p>
                    <span style={{ background:item.type==="wholesale"?"rgba(34,197,94,.15)":"rgba(139,69,19,.15)", color:item.type==="wholesale"?"#22C55E":"#8B4513", padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:700 }}>
                      {item.type === "wholesale" ? "WHOLESALE" : "SINGLE"}
                    </span>
                  </div>
                  <button onClick={()=>removeItem(item.id,item.type)} style={{ background:"rgba(239,68,68,.1)", border:"none", borderRadius:6, padding:"5px 8px", cursor:"pointer", color:"#EF4444" }}><IcoTrash size={14}/></button>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"#643200", borderRadius:8, padding:"4px 8px" }}>
                    <button onClick={()=>updateQty(item.id,item.type,-1)} style={{ background:"none", border:"none", color:"#ffffff", cursor:"pointer", fontSize:18, lineHeight:1 }}>−</button>
                    <span style={{ fontSize:14, fontWeight:600, color:"#ffffff", minWidth:24, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={()=>updateQty(item.id,item.type,1)} style={{ background:"none", border:"none", color:"#fafafa", cursor:"pointer", fontSize:18, lineHeight:1 }}>+</button>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:11, color:"#8A7A60" }}>₹{item.price} × {item.qty}</p>
                    <p style={{ fontSize:16, fontWeight:700, color:"#8B4513" }}>₹{(parseFloat(item.price)*item.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="stat-card" style={{ borderRadius:16, padding:24 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:"#000000", marginBottom:20 }}>Order Summary</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              {[["Subtotal",`₹${subtotal.toFixed(2)}`],["GST (18%)",`₹${tax.toFixed(2)}`]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"#8A7A60" }}>{k}</span>
                  <span style={{ fontSize:13, color:"#000000" }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #2A2418", paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:600, color:"#000000" }}>Total</span>
                <span style={{ fontSize:22, fontWeight:700, color:"#8B4513", fontFamily:"'Playfair Display',serif" }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {!showPayment ? (
              <button className="btn-gold" onClick={()=>setShowPayment(true)} style={{ width:"100%", padding:"13px", borderRadius:10, fontSize:15 }}>
                Proceed to Payment →
              </button>
            ) : (
              <div>
                <h4 style={{ color:"#8B4513", fontSize:13, fontWeight:600, marginBottom:12, textTransform:"uppercase", letterSpacing:".08em" }}>Customer Details</h4>
                {[["Name","name"],["Phone","phone"],["Email","email"],["Address","address"]].map(([label,key])=>(
                  <div key={key} style={{ marginBottom:12 }}>
                    <label style={{ fontSize:11, color:"#8A7A60", display:"block", marginBottom:4 }}>{label}</label>
                    <input className="input-royal" value={formData[key]} onChange={e=>setFormData({...formData,[key]:e.target.value})}
                      style={{ padding:"9px 12px", borderRadius:8, fontSize:13, width:"100%" }} />
                  </div>
                ))}
                <h4 style={{ color:"#8B4513", fontSize:13, fontWeight:600, marginTop:20, marginBottom:12, textTransform:"uppercase", letterSpacing:".08em" }}>Payment Method</h4>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
                  {["UPI","Card","Cash","Online"].map(m=>(
                    <div key={m} className={`payment-option ${payMethod===m?"selected":""}`} onClick={()=>setPayMethod(m)} style={{ textAlign:"center" }}>
                      <p style={{ fontSize:13, fontWeight:600, color:payMethod===m?"#8B4513":"#8A7A60" }}>{m}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(139,69,19,.05)", border:"1px solid rgba(139,69,19,.1)", borderRadius:10, padding:12, marginBottom:16 }}>
                  <p style={{ fontSize:11, color:"#8A7A60", marginBottom:8 }}>{cart.length} item(s) · via {payMethod}</p>
                  {cart.map(item=>(
                    <div key={`${item.id}-${item.type}`} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#000000", marginBottom:4 }}>
                      <span>{item.name} ({item.type}) ×{item.qty}</span>
                      <span style={{ color:"#8B4513" }}>₹{(parseFloat(item.price)*item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-gold" onClick={()=>setOrdered(true)} style={{ width:"100%", padding:"13px", borderRadius:10, fontSize:15 }}>
                  Place Order ₹{total.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
