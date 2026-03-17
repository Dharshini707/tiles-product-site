import { useState } from 'react'
import { Modal } from '../components/UI.jsx'
import { IcoPlus, IcoSearch, IcoEye, IcoEdit, IcoTrash, IcoReport, IcoDownload } from '../components/Icons.jsx'

const inp = { padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%' }
const sel = { padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%', appearance:'none' }

const Field = ({ label, required, children, error }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
    <label style={{ fontSize:12, color:'rgba(17, 24, 39, 0.7)', fontWeight:500 }}>
      {label}{required && <span style={{ color:'#8B4513', marginLeft:3 }}>*</span>}
    </label>
    {children}
    {error && <span style={{ fontSize:11, color:'#EF4444' }}>{error}</span>}
  </div>
)

const SectionTitle = ({ icon, title }) => (
  <p style={{ fontSize:11, color:'#8B4513', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid rgba(139,69,19,.1)' }}>
    {icon} {title}
  </p>
)

const statusColor = s => ({ Completed:'#22C55E', Processing:'#EAB308', Cancelled:'#EF4444' }[s]||'#6B7280')
const statusBg    = s => ({ Completed:'rgba(34,197,94,.1)', Processing:'rgba(234,179,8,.1)', Cancelled:'rgba(239,68,68,.1)' }[s]||'#F3F4F6')

const emptySale = { customer:'', shopName:'', phone:'', email:'', address:'', product:'', productImage:'', brand:'RoyalEdge', size:'600×600mm', qty:'', pricePerUnit:'', discount:'0', coupon:'', paymentMethod:'UPI', paymentStatus:'Paid', orderStatus:'Processing' }

// ── Sale Form Modal ─────────────────────────────────────────────────────────────
const SaleFormModal = ({ open, onClose, onSave, products }) => {
  const [form, setForm]   = useState(emptySale)
  const [errors, setErrors] = useState({})

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})) }

  const handleProductSelect = (name) => {
    const found = products.find(p => p.name === name)
    setForm(f => ({ ...f, product:name, productImage:found?.image||'', size:found?.size||f.size, brand:'RoyalEdge', pricePerUnit:found?.price||'' }))
    setErrors(e => ({...e, product:''}))
  }

  const qty       = parseFloat(form.qty)          || 0
  const unitPrice = parseFloat(form.pricePerUnit) || 0
  const discPct   = parseFloat(form.discount)     || 0
  const subtotal  = qty * unitPrice
  const discAmt   = subtotal * discPct / 100
  const afterDisc = subtotal - discAmt
  const taxAmt    = afterDisc * 0.18
  const total     = afterDisc + taxAmt

  const validate = () => {
    const e = {}
    if (!form.customer.trim())             e.customer    = 'Customer name required'
    if (!form.phone.trim())                e.phone       = 'Phone required'
    if (!form.product.trim())              e.product     = 'Select a product'
    if (!form.qty || qty <= 0)             e.qty         = 'Valid quantity required'
    if (!form.pricePerUnit || unitPrice<=0) e.pricePerUnit = 'Valid price required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    const id = `ORD-${2000 + Math.floor(Math.random()*9000)}`
    onSave({ ...form, id, tax:18, subtotal:subtotal.toFixed(2), discountAmt:discAmt.toFixed(2), taxAmt:taxAmt.toFixed(2), totalAmt:total.toFixed(2), orderDate:new Date().toISOString().split('T')[0] })
    setForm(emptySale); setErrors({}); onClose()
  }

  return (
    <Modal open={open} onClose={()=>{setForm(emptySale);setErrors({});onClose()}} title="Create New Sale" width={860}>
      <div style={{ display:'flex', flexDirection:'column', gap:22 }}>

        {/* 1. Customer */}
        <div>
          <SectionTitle icon="👤" title="Customer Details" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Field label="Customer / Company Name" required error={errors.customer}><input className="input-royal" style={inp} placeholder="e.g. Rajan Builders" value={form.customer} onChange={e=>set('customer',e.target.value)} /></Field>
            <Field label="Shop Name"><input className="input-royal" style={inp} placeholder="e.g. Rajan Constructions" value={form.shopName} onChange={e=>set('shopName',e.target.value)} /></Field>
            <Field label="Phone Number" required error={errors.phone}><input className="input-royal" style={inp} placeholder="+91 98XXXXXXXX" value={form.phone} onChange={e=>set('phone',e.target.value)} /></Field>
            <Field label="Email Address"><input className="input-royal" style={inp} type="email" placeholder="customer@email.com" value={form.email} onChange={e=>set('email',e.target.value)} /></Field>
            <div style={{ gridColumn:'1 / -1' }}><Field label="Address"><input className="input-royal" style={inp} placeholder="City, State" value={form.address} onChange={e=>set('address',e.target.value)} /></Field></div>
          </div>
        </div>

        {/* 2. Product */}
        <div>
          <SectionTitle icon="🏷️" title="Product Details" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Field label="Select Product" required error={errors.product}>
              <select className="input-royal" style={sel} value={form.product} onChange={e=>handleProductSelect(e.target.value)}>
                <option value="">-- Choose Product --</option>
                {products.map(p=><option key={p.id} value={p.name}>{p.name} ({p.size})</option>)}
              </select>
            </Field>
            <Field label="Brand"><input className="input-royal" style={inp} value={form.brand} onChange={e=>set('brand',e.target.value)} /></Field>
            <Field label="Size / Type">
              <select className="input-royal" style={sel} value={form.size} onChange={e=>set('size',e.target.value)}>
                {['600×600mm','800×800mm','300×600mm','1200×600mm','600×1200mm','300×300mm'].map(s=><option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Quantity" required error={errors.qty}><input className="input-royal" style={inp} type="number" min="1" placeholder="e.g. 50" value={form.qty} onChange={e=>set('qty',e.target.value)} /></Field>
          </div>
          {form.productImage && (
            <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:14, background:'rgba(139,69,19,.05)', border:'1px solid rgba(139,69,19,.15)', borderRadius:10, padding:12 }}>
              <img src={form.productImage} alt={form.product} style={{ width:70, height:70, objectFit:'cover', borderRadius:8 }} onError={e=>e.target.style.display='none'} />
              <div><p style={{ fontSize:14, fontWeight:600, color:'#111827', marginBottom:2 }}>{form.product}</p><p style={{ fontSize:12, color:'#6B7280' }}>{form.size} · {form.brand}</p></div>
            </div>
          )}
        </div>

        {/* 3+4. Pricing + Discount */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div>
            <SectionTitle icon="💰" title="Price Details" />
            <Field label="Price Per Unit (₹)" required error={errors.pricePerUnit}><input className="input-royal" style={inp} type="number" min="0" placeholder="0.00" value={form.pricePerUnit} onChange={e=>set('pricePerUnit',e.target.value)} /></Field>
            <div style={{ marginTop:12, background:'rgba(139,69,19,.05)', border:'1px solid rgba(139,69,19,.15)', borderRadius:8, padding:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13 }}><span style={{ color:'#6B7280' }}>Qty × Price</span><span style={{ color:'#4B5563' }}>{qty} × ₹{unitPrice.toFixed(2)}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:600 }}><span style={{ color:'#4B5563' }}>Subtotal</span><span style={{ color:'#8B4513' }}>₹{subtotal.toFixed(2)}</span></div>
            </div>
          </div>
          <div>
            <SectionTitle icon="🏷️" title="Discount Details" />
            <Field label="Discount %"><select className="input-royal" style={sel} value={form.discount} onChange={e=>set('discount',e.target.value)}>{['0','5','10','15','20','25'].map(d=><option key={d} value={d}>{d}%</option>)}</select></Field>
            <div style={{ marginTop:12 }}><Field label="Coupon Code (optional)"><input className="input-royal" style={inp} placeholder="e.g. ROYAL10" value={form.coupon} onChange={e=>set('coupon',e.target.value)} /></Field></div>
            {discPct>0 && <div style={{ marginTop:10, background:'rgba(34,197,94,.05)', border:'1px solid rgba(34,197,94,.2)', borderRadius:8, padding:10, display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:12, color:'#6B7280' }}>You save</span><span style={{ fontSize:14, fontWeight:700, color:'#22C55E' }}>₹{discAmt.toFixed(2)}</span></div>}
          </div>
        </div>

        {/* 5. Final Summary */}
        <div style={{ background:'linear-gradient(145deg,#FFFFFF,#F9FAFB)', border:'1px solid #E5E7EB', borderRadius:14, padding:18 }}>
          <SectionTitle icon="🧾" title="Final Payment Summary" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {[{ label:'Subtotal', value:`₹${subtotal.toFixed(2)}`, color:'#4B5563' },{ label:`Discount ${discPct}%`, value:`-₹${discAmt.toFixed(2)}`, color:'#22C55E' },{ label:'GST 18%', value:`₹${taxAmt.toFixed(2)}`, color:'#EAB308' },{ label:'Total Amount', value:`₹${total.toFixed(2)}`, color:'#8B4513' }].map(item=>(
              <div key={item.label} style={{ textAlign:'center', background:'rgba(0,0,0,.02)', borderRadius:10, padding:12, border:'1px solid #F3F4F6' }}>
                <p style={{ fontSize:10, color:'#6B7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'.06em' }}>{item.label}</p>
                <p style={{ fontSize:item.label==='Total Amount'?18:15, fontWeight:700, color:item.color, fontFamily:"'Playfair Display',serif" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6+7. Payment + Order */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div>
            <SectionTitle icon="💳" title="Payment Information" />
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <Field label="Payment Method"><select className="input-royal" style={sel} value={form.paymentMethod} onChange={e=>set('paymentMethod',e.target.value)}>{['Cash','UPI','Card','Online','Bank Transfer'].map(m=><option key={m}>{m}</option>)}</select></Field>
              <Field label="Payment Status"><select className="input-royal" style={sel} value={form.paymentStatus} onChange={e=>set('paymentStatus',e.target.value)}><option>Paid</option><option>Pending</option><option>Partial</option></select></Field>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {['Cash','UPI','Card','Online'].map(m=>(
                  <div key={m} onClick={()=>set('paymentMethod',m)} style={{ textAlign:'center', padding:'8px 4px', borderRadius:8, cursor:'pointer', border:`2px solid ${form.paymentMethod===m?'#8B4513':'#E5E7EB'}`, background:form.paymentMethod===m?'rgba(139,69,19,.05)':'transparent', transition:'all .2s' }}>
                    <div style={{ fontSize:16, marginBottom:2 }}>{ {'Cash':'💵','UPI':'📱','Card':'💳','Online':'🌐'}[m] }</div>
                    <p style={{ fontSize:10, color:form.paymentMethod===m?'#8B4513':'#6B7280', fontWeight:600 }}>{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <SectionTitle icon="📋" title="Order Information" />
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <Field label="Order Status"><select className="input-royal" style={sel} value={form.orderStatus} onChange={e=>set('orderStatus',e.target.value)}><option>Processing</option><option>Completed</option><option>Cancelled</option></select></Field>
              <div style={{ background:'rgba(139,69,19,.05)', border:'1px solid rgba(139,69,19,.12)', borderRadius:10, padding:14, display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}><span style={{ color:'#6B7280' }}>Invoice No.</span><span style={{ color:'#8B4513', fontWeight:600 }}>Auto-generated</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}><span style={{ color:'#6B7280' }}>Date</span><span style={{ color:'#111827' }}>{new Date().toLocaleDateString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:12, paddingTop:8, borderTop:'1px solid #E5E7EB' }}>
          <button className="btn-outline" onClick={()=>{setForm(emptySale);setErrors({});onClose()}} style={{ flex:1, padding:'12px', borderRadius:10, fontSize:14 }}>Cancel</button>
          <button className="btn-gold" onClick={handleSave} style={{ flex:2, padding:'12px', borderRadius:10, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <IcoPlus size={16}/> Create Sale — ₹{total.toFixed(2)}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main Sales Page ─────────────────────────────────────────────────────────────
const SalesPage = ({ sales, setSales, products }) => {
  const [viewSale, setViewSale] = useState(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState({ status:'', payment:'' })
  const [page, setPage]         = useState(1)
  const [toast, setToast]       = useState('')
  const perPage = 8

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 2500) }

  const filtered = sales.filter(s =>
    (s.customer.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())) &&
    (!filter.status  || s.orderStatus   === filter.status) &&
    (!filter.payment || s.paymentMethod === filter.payment)
  )
  const pages = Math.ceil(filtered.length / perPage)
  const shown = filtered.slice((page-1)*perPage, page*perPage)

  const handleAddSale = data => {
    setSales(prev => [data, ...prev])
    showToast(`✓ Sale ${data.id} created — ₹${data.totalAmt}`)
  }

  const handleDelete = id => {
    if (window.confirm(`Delete order ${id}?`)) {
      setSales(prev => prev.filter(s=>s.id!==id))
      setViewSale(null)
      showToast(`Order ${id} deleted.`)
    }
  }

  return (
    <div style={{ padding:24 }}>
      {toast && (
        <div className="scale-in" style={{ position:'fixed', top:80, right:24, background:'linear-gradient(135deg,#8B4513,#A0522D)', color:'#0F0E0C', padding:'12px 20px', borderRadius:10, fontWeight:600, fontSize:14, zIndex:9999, boxShadow:'0 8px 24px rgba(139,69,19,.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#111827', marginBottom:4 }}>Sales Management</h2>
          <p style={{ color:'#6B7280', fontSize:13 }}>{filtered.length} of {sales.length} transactions</p>
        </div>
        <button className="btn-gold" onClick={()=>setShowAdd(true)} style={{ padding:'10px 22px', borderRadius:10, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
          <IcoPlus size={16}/> New Sale
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Revenue',   value:`₹${(sales.reduce((a,s)=>a+parseFloat(s.totalAmt||0),0)/1000).toFixed(1)}K` },
          { label:'Completed',       value: sales.filter(s=>s.orderStatus==='Completed').length },
          { label:'Processing',      value: sales.filter(s=>s.orderStatus==='Processing').length },
          { label:'Pending Payment', value: sales.filter(s=>s.paymentStatus==='Pending').length },
        ].map((s,i)=>(
          <div key={s.label} className="stat-card fade-up" style={{ borderRadius:12, padding:20, animationDelay:`${i*80}ms`, animationFillMode:'both' }}>
            <p style={{ fontSize:11, color:'#6B7280', marginBottom:6, textTransform:'uppercase', letterSpacing:'.08em' }}>{s.label}</p>
            <p style={{ fontSize:24, fontWeight:700, color:'#8B4513', fontFamily:"'Playfair Display',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <div style={{ position:'relative', flex:1 }}>
          <input className="input-royal" placeholder="Search order ID or customer..." value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:'10px 12px 10px 38px', borderRadius:10, fontSize:13, width:'100%' }} />
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#6B7280' }}><IcoSearch size={16}/></span>
        </div>
        <select className="input-royal" value={filter.status} onChange={e=>setFilter({...filter,status:e.target.value})} style={{ padding:'10px 14px', borderRadius:10, fontSize:13, minWidth:140 }}>
          <option value="">All Status</option><option>Completed</option><option>Processing</option><option>Cancelled</option>
        </select>
        <select className="input-royal" value={filter.payment} onChange={e=>setFilter({...filter,payment:e.target.value})} style={{ padding:'10px 14px', borderRadius:10, fontSize:13, minWidth:140 }}>
          <option value="">All Payments</option><option>Cash</option><option>UPI</option><option>Card</option><option>Online</option>
        </select>
      </div>

      <div className="stat-card fade-up" style={{ borderRadius:16, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="table-royal">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Method</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {shown.map(s=>(
                <tr key={s.id}>
                  <td style={{ color:'#8B4513', fontWeight:600 }}>{s.id}</td>
                  <td><div><p style={{ color:'#111827', fontSize:13 }}>{s.customer}</p><p style={{ color:'#6B7280', fontSize:11 }}>{s.phone}</p></div></td>
                  <td>{s.product}</td>
                  <td>{s.qty}</td>
                  <td style={{ color:'#22C55E', fontWeight:600 }}>₹{s.totalAmt}</td>
                  <td>{s.paymentMethod}</td>
                  <td><span style={{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:s.paymentStatus==='Paid'?'rgba(34,197,94,.15)':'rgba(239,68,68,.15)', color:s.paymentStatus==='Paid'?'#22C55E':'#EF4444' }}>{s.paymentStatus}</span></td>
                  <td><span style={{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:statusBg(s.orderStatus), color:statusColor(s.orderStatus) }}>{s.orderStatus}</span></td>
                  <td style={{ fontSize:12 }}>{s.orderDate}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>setViewSale(s)} style={{ background:'rgba(139,69,19,.1)', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#8B4513' }}><IcoEye size={14}/></button>
                      <button style={{ background:'rgba(93,64,55,.1)', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#5D4037' }}><IcoEdit size={14}/></button>
                      <button onClick={()=>handleDelete(s.id)} style={{ background:'rgba(239,68,68,.1)', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#EF4444' }}><IcoTrash size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:8, padding:16 }}>
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)} style={{ width:32, height:32, borderRadius:6, border:page===p?'none':'1px solid #E5E7EB', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, background:page===p?'linear-gradient(135deg,#8B4513,#A0522D)':'#F3F4F6', color:page===p?'#FFFFFF':'#6B7280' }}>{p}</button>
          ))}
        </div>
      </div>

      <SaleFormModal open={showAdd} onClose={()=>setShowAdd(false)} onSave={handleAddSale} products={products} />

      <Modal open={!!viewSale} onClose={()=>setViewSale(null)} title={`Order ${viewSale?.id}`} width={740}>
        {viewSale && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div style={{ background:'#F9FAFB', borderRadius:12, padding:16, border:'1px solid #E5E7EB' }}>
                <h4 style={{ color:'#8B4513', fontSize:13, fontWeight:600, marginBottom:12, textTransform:'uppercase', letterSpacing:'.08em' }}>Customer Details</h4>
                {[['Name',viewSale.customer],['Phone',viewSale.phone],['Email',viewSale.email||'—'],['Address',viewSale.address||'—']].map(([k,v])=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontSize:12, color:'#6B7280' }}>{k}</span><span style={{ fontSize:12, color:'#111827' }}>{v}</span></div>
                ))}
              </div>
              <div style={{ background:'#F9FAFB', borderRadius:12, padding:16, border:'1px solid #E5E7EB' }}>
                <h4 style={{ color:'#8B4513', fontSize:13, fontWeight:600, marginBottom:12, textTransform:'uppercase', letterSpacing:'.08em' }}>Product Details</h4>
                {viewSale.productImage && <img src={viewSale.productImage} alt="" style={{ width:'100%', height:80, objectFit:'cover', borderRadius:8, marginBottom:10 }} onError={e=>e.target.style.display='none'} />}
                {[['Product',viewSale.product],['Brand',viewSale.brand||'RoyalEdge'],['Size',viewSale.size],['Qty',`${viewSale.qty} units`]].map(([k,v])=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:12, color:'#6B7280' }}>{k}</span><span style={{ fontSize:12, color:'#111827' }}>{v}</span></div>
                ))}
              </div>
            </div>
            <div style={{ background:'#F9FAFB', borderRadius:12, padding:16, border:'1px solid #E5E7EB' }}>
              <h4 style={{ color:'#8B4513', fontSize:13, fontWeight:600, marginBottom:12, textTransform:'uppercase', letterSpacing:'.08em' }}>Price Breakdown</h4>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[['Price/Unit',`₹${viewSale.pricePerUnit}`],['Subtotal',`₹${viewSale.subtotal}`],[`Discount (${viewSale.discount}%)`,`-₹${viewSale.discountAmt}`],['GST 18%',`₹${viewSale.taxAmt}`],['Payment',viewSale.paymentMethod],['Status',viewSale.paymentStatus]].map(([k,v])=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:12, color:'#6B7280' }}>{k}</span><span style={{ fontSize:12, color:'#111827' }}>{v}</span></div>
                ))}
              </div>
              <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid #E5E7EB', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:600, color:'#111827' }}>Total Amount</span>
                <span style={{ fontSize:22, fontWeight:700, color:'#8B4513', fontFamily:"'Playfair Display',serif" }}>₹{viewSale.totalAmt}</span>
              </div>
            </div>
            <div style={{ background:'#F9FAFB', borderRadius:12, padding:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, border:'1px solid #E5E7EB' }}>
              {[['Order ID',viewSale.id],['Date',viewSale.orderDate],['Status',viewSale.orderStatus]].map(([k,v])=>(
                <div key={k}><p style={{ fontSize:10, color:'#6B7280', marginBottom:4, textTransform:'uppercase' }}>{k}</p><p style={{ fontSize:13, color:'#111827', fontWeight:500 }}>{v}</p></div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-gold" style={{ flex:1, padding:'10px', borderRadius:10, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><IcoReport size={14}/> Invoice</button>
              <button className="btn-outline" style={{ flex:1, padding:'10px', borderRadius:10, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><IcoDownload size={14}/> Download</button>
              <button style={{ flex:1, padding:'10px', borderRadius:10, fontSize:13, background:'rgba(93,64,55,.15)', border:'1px solid rgba(93,64,55,.3)', color:'#5D4037', cursor:'pointer', fontFamily:"'Outfit',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><IcoEdit size={14}/> Edit</button>
              <button onClick={()=>handleDelete(viewSale.id)} style={{ padding:'10px 16px', borderRadius:10, background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)', color:'#EF4444', cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}><IcoTrash size={14}/></button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SalesPage
