import { useState } from 'react'
import { Modal, StarRating } from '../components/UI.jsx'
import { IcoPlus, IcoSearch, IcoHeart, IcoEye, IcoEdit, IcoTrash } from '../components/Icons.jsx'

const inp = { padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%' }
const sel = { padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%', appearance:'none' }

const Field = ({ label, required, children, error }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
    <label style={{ fontSize:12, color:'#8A7A60', fontWeight:500 }}>
      {label}{required && <span style={{ color:'#D4A853', marginLeft:3 }}>*</span>}
    </label>
    {children}
    {error && <span style={{ fontSize:11, color:'#EF4444' }}>{error}</span>}
  </div>
)

const SectionTitle = ({ icon, title }) => (
  <p style={{ fontSize:11, color:'#D4A853', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14, paddingBottom:8, borderBottom:'1px solid rgba(212,168,83,.15)' }}>
    {icon} {title}
  </p>
)

const emptyForm = { name:'', shop:'', price:'', wholesalePrice:'', size:'600×600mm', material:'Ceramic', category:'Floor', rating:'4.5', reviews:'0', description:'', inStock:true, image:'' }

const ProductFormModal = ({ open, onClose, onSave, initial }) => {
  const isEdit = !!initial?.id
  const [form, setForm]       = useState(isEdit ? initial : emptyForm)
  const [errors, setErrors]   = useState({})
  const [preview, setPreview] = useState(initial?.image || '')

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})) }

  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { set('image',ev.target.result); setPreview(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())                                  e.name          = 'Product name is required'
    if (!form.shop.trim())                                  e.shop          = 'Shop / brand is required'
    if (!form.price || isNaN(form.price) || +form.price<=0) e.price         = 'Valid single price required'
    if (!form.wholesalePrice || isNaN(form.wholesalePrice) || +form.wholesalePrice<=0) e.wholesalePrice = 'Valid wholesale price required'
    if (!form.description.trim())                           e.description   = 'Description is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({ ...form, price:parseFloat(form.price).toFixed(2), wholesalePrice:parseFloat(form.wholesalePrice).toFixed(2), rating:parseFloat(form.rating||4.5).toFixed(1), reviews:parseInt(form.reviews||0) })
    setForm(emptyForm); setPreview(''); setErrors({}); onClose()
  }

  const handleClose = () => { setForm(emptyForm); setPreview(''); setErrors({}); onClose() }

  // sync when editing a different product
  if (isEdit && initial && form.id !== initial.id) {
    setForm(initial); setPreview(initial.image||'')
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEdit?`Edit — ${initial?.name}`:'Add New Product'} width={800}>
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        <div>
          <SectionTitle icon="📦" title="Product Information" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="Product Name" required error={errors.name}><input className="input-royal" style={inp} placeholder="e.g. Marble Luxe 600" value={form.name} onChange={e=>set('name',e.target.value)} /></Field>
            <Field label="Shop / Brand Name" required error={errors.shop}><input className="input-royal" style={inp} placeholder="e.g. LuxeTile Co." value={form.shop} onChange={e=>set('shop',e.target.value)} /></Field>
            <Field label="Tile Size"><select className="input-royal" style={sel} value={form.size} onChange={e=>set('size',e.target.value)}>{['600×600mm','800×800mm','300×600mm','1200×600mm','600×1200mm','300×300mm','400×400mm'].map(s=><option key={s}>{s}</option>)}</select></Field>
            <Field label="Material"><select className="input-royal" style={sel} value={form.material} onChange={e=>set('material',e.target.value)}>{['Ceramic','Vitrified','Porcelain','Natural Stone','Marble','Granite','Mosaic'].map(m=><option key={m}>{m}</option>)}</select></Field>
            <Field label="Category"><select className="input-royal" style={sel} value={form.category} onChange={e=>set('category',e.target.value)}>{['Floor','Wall','Outdoor','Bathroom','Kitchen','Parking'].map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Availability"><select className="input-royal" style={sel} value={form.inStock?'in':'out'} onChange={e=>set('inStock',e.target.value==='in')}><option value="in">In Stock</option><option value="out">Out of Stock</option></select></Field>
          </div>
        </div>

        <div>
          <SectionTitle icon="💰" title="Pricing & Rating" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:16 }}>
            <Field label="Single Rate (₹)" required error={errors.price}><input className="input-royal" style={inp} type="number" min="0" placeholder="0.00" value={form.price} onChange={e=>set('price',e.target.value)} /></Field>
            <Field label="Wholesale Rate (₹)" required error={errors.wholesalePrice}><input className="input-royal" style={inp} type="number" min="0" placeholder="0.00" value={form.wholesalePrice} onChange={e=>set('wholesalePrice',e.target.value)} /></Field>
            <Field label="Rating (0–5)"><input className="input-royal" style={inp} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e=>set('rating',e.target.value)} /></Field>
            <Field label="Reviews"><input className="input-royal" style={inp} type="number" min="0" value={form.reviews} onChange={e=>set('reviews',e.target.value)} /></Field>
          </div>
          {(form.price||form.wholesalePrice) && (
            <div style={{ display:'flex', gap:12, marginTop:12 }}>
              {form.price && <div style={{ flex:1, background:'rgba(212,168,83,.07)', border:'1px solid rgba(212,168,83,.2)', borderRadius:10, padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}><span style={{ fontSize:12, color:'#8A7A60' }}>Single Preview</span><span style={{ fontSize:18, fontWeight:700, color:'#D4A853', fontFamily:"'Playfair Display',serif" }}>₹{parseFloat(form.price||0).toFixed(2)}</span></div>}
              {form.wholesalePrice && <div style={{ flex:1, background:'rgba(34,197,94,.07)', border:'1px solid rgba(34,197,94,.2)', borderRadius:10, padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}><span style={{ fontSize:12, color:'#8A7A60' }}>Wholesale Preview</span><span style={{ fontSize:18, fontWeight:700, color:'#22C55E', fontFamily:"'Playfair Display',serif" }}>₹{parseFloat(form.wholesalePrice||0).toFixed(2)}</span></div>}
            </div>
          )}
        </div>

        <div>
          <SectionTitle icon="🖼️" title="Product Image" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignItems:'start' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <Field label="Image URL"><input className="input-royal" style={inp} placeholder="https://..." value={form.image&&form.image.startsWith('http')?form.image:''} onChange={e=>{set('image',e.target.value);setPreview(e.target.value)}} /></Field>
              <div style={{ textAlign:'center', color:'#4A3E2C', fontSize:11 }}>— OR UPLOAD —</div>
              <label style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(212,168,83,.06)', border:'2px dashed rgba(212,168,83,.3)', borderRadius:8, padding:'12px 14px', cursor:'pointer', color:'#D4A853', fontSize:13, fontWeight:500 }}>
                <span style={{ fontSize:20 }}>📁</span> Choose Image File
                <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
              </label>
            </div>
            <div style={{ background:'#141210', borderRadius:12, overflow:'hidden', border:'1px solid #2A2418', height:160, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {preview ? <img src={preview} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.src='https://placehold.co/400x300/1A1814/D4A853?text=Invalid'}} />
                : <div style={{ textAlign:'center', color:'#4A3E2C' }}><div style={{ fontSize:36, marginBottom:6 }}>🏷️</div><p style={{ fontSize:11 }}>Preview here</p></div>}
            </div>
          </div>
        </div>

        <div>
          <SectionTitle icon="📝" title="Description" />
          <Field label="Product Description" required error={errors.description}>
            <textarea className="input-royal" placeholder="Describe tile finish, application, quality..." value={form.description} onChange={e=>set('description',e.target.value)} style={{ ...inp, minHeight:90, resize:'vertical', lineHeight:1.6 }} />
          </Field>
        </div>

        <div style={{ display:'flex', gap:12, paddingTop:8, borderTop:'1px solid rgba(42,36,24,.5)' }}>
          <button className="btn-outline" onClick={handleClose} style={{ flex:1, padding:'12px', borderRadius:10, fontSize:14 }}>Cancel</button>
          <button className="btn-gold" onClick={handleSave} style={{ flex:2, padding:'12px', borderRadius:10, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <IcoPlus size={16}/> {isEdit?'Save Changes':'Add Product'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main Products Page ──────────────────────────────────────────────────────────
const ProductsPage = ({ setCart, products, setProducts }) => {
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState({ material:'', category:'', stock:'' })
  const [page, setPage]               = useState(1)
  const [viewProduct, setViewProduct] = useState(null)
  const [editProduct, setEditProduct] = useState(null)
  const [showAdd, setShowAdd]         = useState(false)
  const [wishlist, setWishlist]       = useState([])
  const [toast, setToast]             = useState('')
  const perPage = 8

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 2500) }

  const filtered = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.shop.toLowerCase().includes(search.toLowerCase())) &&
    (!filter.material || p.material===filter.material) &&
    (!filter.category || p.category===filter.category) &&
    (!filter.stock || (filter.stock==='in' ? p.inStock : !p.inStock))
  )
  const pages = Math.ceil(filtered.length / perPage)
  const shown = filtered.slice((page-1)*perPage, page*perPage)

  const addToCart = (product, type) => {
    const price = type==='wholesale' ? product.wholesalePrice : product.price
    setCart(prev => {
      const ex = prev.find(i=>i.id===product.id&&i.type===type)
      if (ex) return prev.map(i=>i.id===product.id&&i.type===type?{...i,qty:i.qty+1}:i)
      return [...prev,{...product,type,price,qty:1}]
    })
    showToast(`${product.name} (${type}) added to cart!`)
  }

  const handleAdd = data => {
    setProducts(prev => [{...data, id:Date.now()}, ...prev])
    showToast(`✓ "${data.name}" added to catalog!`)
  }

  const handleEdit = data => {
    setProducts(prev => prev.map(p => p.id===data.id ? data : p))
    showToast(`✓ "${data.name}" updated!`)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      setProducts(prev => prev.filter(p=>p.id!==id))
      showToast(`"${name}" removed.`)
    }
  }

  const toggleWishlist = id => setWishlist(prev=>prev.includes(id)?prev.filter(w=>w!==id):[...prev,id])

  return (
    <div style={{ padding:24 }}>
      {toast && (
        <div className="scale-in" style={{ position:'fixed', top:80, right:24, background:'linear-gradient(135deg,#D4A853,#C8965E)', color:'#0F0E0C', padding:'12px 20px', borderRadius:10, fontWeight:600, fontSize:14, zIndex:9999, boxShadow:'0 8px 24px rgba(212,168,83,.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#E8DCC8', marginBottom:4 }}>Product Catalog</h2>
          <p style={{ color:'#6B5E4A', fontSize:13 }}>{filtered.length} of {products.length} products</p>
        </div>
        <button className="btn-gold" onClick={()=>setShowAdd(true)} style={{ padding:'10px 22px', borderRadius:10, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
          <IcoPlus size={16}/> Add New Product
        </button>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <input className="input-royal" placeholder="Search products or shop..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} style={{ padding:'10px 12px 10px 38px', borderRadius:10, fontSize:13, width:'100%' }} />
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#6B5E4A' }}><IcoSearch size={16}/></span>
        </div>
        <select className="input-royal" value={filter.material} onChange={e=>{setFilter({...filter,material:e.target.value});setPage(1)}} style={{ padding:'10px 14px', borderRadius:10, fontSize:13, minWidth:130 }}>
          <option value="">Material</option>{['Ceramic','Vitrified','Porcelain','Natural Stone','Marble','Granite','Mosaic'].map(o=><option key={o}>{o}</option>)}
        </select>
        <select className="input-royal" value={filter.category} onChange={e=>{setFilter({...filter,category:e.target.value});setPage(1)}} style={{ padding:'10px 14px', borderRadius:10, fontSize:13, minWidth:130 }}>
          <option value="">Category</option>{['Floor','Wall','Outdoor','Bathroom','Kitchen','Parking'].map(o=><option key={o}>{o}</option>)}
        </select>
        <select className="input-royal" value={filter.stock} onChange={e=>{setFilter({...filter,stock:e.target.value});setPage(1)}} style={{ padding:'10px 14px', borderRadius:10, fontSize:13, minWidth:130 }}>
          <option value="">Stock</option><option value="in">In Stock</option><option value="out">Out of Stock</option>
        </select>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:24 }}>
        {shown.map((p,i)=>(
          <div key={p.id} className="tile-card card-hover fade-up" style={{ borderRadius:16, overflow:'hidden', animationDelay:`${i*60}ms`, animationFillMode:'both' }}>
            <div style={{ position:'relative' }}>
              <img src={p.image} alt={p.name} style={{ width:'100%', height:180, objectFit:'cover' }} onError={e=>{e.target.src='https://placehold.co/400x300/1A1814/D4A853?text=Tile'}} />
              <div style={{ position:'absolute', top:10, left:10 }}><span className={`badge-stock ${p.inStock?'badge-in':'badge-out'}`}>{p.inStock?'● In Stock':'● Out of Stock'}</span></div>
              <button onClick={()=>toggleWishlist(p.id)} style={{ position:'absolute', top:10, right:10, background:'rgba(15,14,12,.75)', border:'none', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:wishlist.includes(p.id)?'#EF4444':'#8A7A60' }}><IcoHeart size={13}/></button>
            </div>
            <div style={{ padding:16 }}>
              <p style={{ fontSize:11, color:'#D4A853', letterSpacing:'.08em', marginBottom:4 }}>{p.shop}</p>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:'#E8DCC8', marginBottom:8 }}>{p.name}</h3>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                {[p.size, p.material, p.category].map(tag=><span key={tag} style={{ background:'rgba(212,168,83,.1)', color:'#D4A853', fontSize:10, padding:'2px 8px', borderRadius:4, fontWeight:500 }}>{tag}</span>)}
              </div>
              <p style={{ fontSize:11, color:'#6B5E4A', lineHeight:1.5, marginBottom:10 }}>{(p.description||'').slice(0,70)}...</p>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}><StarRating rating={p.rating}/><span style={{ fontSize:11, color:'#8A7A60' }}>{p.rating} ({p.reviews})</span></div>
              <div style={{ background:'rgba(212,168,83,.05)', borderRadius:8, padding:10, marginBottom:12, border:'1px solid rgba(212,168,83,.1)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}><span style={{ fontSize:11, color:'#8A7A60' }}>Single</span><span style={{ fontSize:14, fontWeight:700, color:'#D4A853' }}>₹{p.price}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:11, color:'#8A7A60' }}>Wholesale</span><span style={{ fontSize:14, fontWeight:700, color:'#22C55E' }}>₹{p.wholesalePrice}</span></div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn-gold" onClick={()=>addToCart(p,'single')} disabled={!p.inStock} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:11 }}>Single</button>
                  <button disabled={!p.inStock} onClick={()=>addToCart(p,'wholesale')} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:11, background:'rgba(34,197,94,.15)', border:'1px solid rgba(34,197,94,.3)', color:'#22C55E', cursor:p.inStock?'pointer':'not-allowed', fontFamily:"'Outfit',sans-serif", fontWeight:600, opacity:p.inStock?1:.5 }}>Wholesale</button>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn-outline" onClick={()=>setViewProduct(p)} style={{ flex:2, padding:'6px', borderRadius:8, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><IcoEye size={12}/> View</button>
                  <button onClick={()=>setEditProduct(p)} style={{ flex:1, padding:'6px', borderRadius:8, background:'rgba(59,130,246,.12)', border:'1px solid rgba(59,130,246,.25)', color:'#3B82F6', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><IcoEdit size={12}/></button>
                  <button onClick={()=>handleDelete(p.id,p.name)} style={{ flex:1, padding:'6px', borderRadius:8, background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.25)', color:'#EF4444', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><IcoTrash size={12}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
        {Array.from({length:pages},(_,i)=>i+1).map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{ width:36, height:36, borderRadius:8, border:page===p?'none':'1px solid #2A2418', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:13, background:page===p?'linear-gradient(135deg,#D4A853,#C8965E)':'#1A1814', color:page===p?'#0F0E0C':'#8A7A60' }}>{p}</button>
        ))}
      </div>

      <ProductFormModal open={showAdd}       onClose={()=>setShowAdd(false)}    onSave={handleAdd}  initial={null} />
      <ProductFormModal open={!!editProduct} onClose={()=>setEditProduct(null)} onSave={handleEdit} initial={editProduct} />

      <Modal open={!!viewProduct} onClose={()=>setViewProduct(null)} title={viewProduct?.name||''} width={700}>
        {viewProduct && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            <img src={viewProduct.image} alt={viewProduct.name} style={{ width:'100%', height:240, objectFit:'cover', borderRadius:12 }} onError={e=>{e.target.src='https://placehold.co/400x300/1A1814/D4A853?text=Tile'}} />
            <div>
              <p style={{ color:'#D4A853', fontSize:12, letterSpacing:'.1em', marginBottom:8 }}>{viewProduct.shop}</p>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}><StarRating rating={viewProduct.rating}/><span style={{ fontSize:12, color:'#8A7A60' }}>{viewProduct.reviews} reviews</span></div>
              <p style={{ color:'#C8B898', fontSize:13, lineHeight:1.7, marginBottom:16 }}>{viewProduct.description}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                {[['Size',viewProduct.size],['Material',viewProduct.material],['Category',viewProduct.category],['Stock',viewProduct.inStock?'In Stock':'Out of Stock']].map(([k,v])=>(
                  <div key={k} style={{ background:'#141210', borderRadius:8, padding:10 }}><p style={{ fontSize:10, color:'#6B5E4A', marginBottom:2 }}>{k}</p><p style={{ fontSize:13, color:'#E8DCC8', fontWeight:500 }}>{v}</p></div>
                ))}
              </div>
              <div style={{ background:'rgba(212,168,83,.06)', border:'1px solid rgba(212,168,83,.2)', borderRadius:10, padding:14, marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontSize:13, color:'#8A7A60' }}>Single Rate</span><span style={{ fontSize:18, fontWeight:700, color:'#D4A853' }}>₹{viewProduct.price}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:13, color:'#8A7A60' }}>Wholesale Rate</span><span style={{ fontSize:18, fontWeight:700, color:'#22C55E' }}>₹{viewProduct.wholesalePrice}</span></div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn-gold" onClick={()=>{addToCart(viewProduct,'single');setViewProduct(null)}} style={{ flex:1, padding:'10px', borderRadius:8, fontSize:13 }}>Add Single</button>
                <button onClick={()=>{addToCart(viewProduct,'wholesale');setViewProduct(null)}} style={{ flex:1, padding:'10px', borderRadius:8, fontSize:13, background:'rgba(34,197,94,.15)', border:'1px solid rgba(34,197,94,.3)', color:'#22C55E', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:600 }}>Add Wholesale</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ProductsPage
