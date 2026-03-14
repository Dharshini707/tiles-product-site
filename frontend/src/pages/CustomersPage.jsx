import { useState } from 'react'
import { Modal } from '../components/UI.jsx'
import { IcoPlus, IcoSearch, IcoEdit, IcoTrash } from '../components/Icons.jsx'

const inputStyle = { padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%' }

const CustomersPage = ({ customers, setCustomers }) => {
  const [search, setSearch]             = useState('')
  const [editCustomer, setEditCustomer] = useState(null)
  const [showAdd, setShowAdd]           = useState(false)
  const [newCust, setNewCust]           = useState({ name:'', phone:'', email:'', address:'' })
  const [toast, setToast]               = useState('')

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 2500) }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding:24 }}>
      {toast && (
        <div className="scale-in" style={{ position:'fixed', top:80, right:24, background:'linear-gradient(135deg,#D4A853,#C8965E)', color:'#0F0E0C', padding:'12px 20px', borderRadius:10, fontWeight:600, fontSize:14, zIndex:9999, boxShadow:'0 8px 24px rgba(212,168,83,.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#E8DCC8', marginBottom:4 }}>Customer Management</h2>
          <p style={{ color:'#6B5E4A', fontSize:13 }}>{filtered.length} of {customers.length} customers</p>
        </div>
        <button className="btn-gold" onClick={()=>setShowAdd(true)} style={{ padding:'10px 20px', borderRadius:10, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
          <IcoPlus size={16}/> Add Customer
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Customers', value: customers.length },
          { label:'Total Orders',    value: customers.reduce((a,c)=>a+c.orders,0) },
          { label:'Total Revenue',   value:`₹${(customers.reduce((a,c)=>a+parseFloat(c.totalPurchase||0),0)/1000).toFixed(1)}K` },
        ].map((s,i)=>(
          <div key={s.label} className="stat-card fade-up" style={{ borderRadius:12, padding:20, animationDelay:`${i*80}ms`, animationFillMode:'both' }}>
            <p style={{ fontSize:11, color:'#8A7A60', marginBottom:6, textTransform:'uppercase', letterSpacing:'.08em' }}>{s.label}</p>
            <p style={{ fontSize:26, fontWeight:700, color:'#D4A853', fontFamily:"'Playfair Display',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ position:'relative', marginBottom:20, maxWidth:400 }}>
        <input className="input-royal" placeholder="Search by name, email or phone..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ padding:'10px 12px 10px 38px', borderRadius:10, fontSize:13, width:'100%' }} />
        <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#6B5E4A' }}><IcoSearch size={16}/></span>
      </div>

      <div className="stat-card fade-up" style={{ borderRadius:16, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="table-royal">
            <thead><tr><th>Customer ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Orders</th><th>Total Purchase</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id}>
                  <td style={{ color:'#D4A853' }}>{c.id}</td>
                  <td style={{ color:'#E8DCC8', fontWeight:500 }}>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{c.address}</td>
                  <td style={{ textAlign:'center' }}>{c.orders}</td>
                  <td style={{ color:'#22C55E', fontWeight:600 }}>₹{parseFloat(c.totalPurchase||0).toLocaleString()}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>setEditCustomer(c)} style={{ background:'rgba(59,130,246,.1)', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#3B82F6' }}><IcoEdit size={14}/></button>
                      <button onClick={()=>{ if(window.confirm(`Delete ${c.name}?`)){ setCustomers(prev=>prev.filter(x=>x.id!==c.id)); showToast(`${c.name} removed.`) } }} style={{ background:'rgba(239,68,68,.1)', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#EF4444' }}><IcoTrash size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Customer" width={500}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[['Full Name','name','text'],['Phone Number','phone','tel'],['Email Address','email','email'],['Address','address','text']].map(([label,key,type])=>(
            <div key={key}>
              <label style={{ fontSize:12, color:'#8A7A60', display:'block', marginBottom:6 }}>{label}</label>
              <input className="input-royal" type={type} value={newCust[key]} onChange={e=>setNewCust({...newCust,[key]:e.target.value})} style={inputStyle} />
            </div>
          ))}
          <button className="btn-gold" onClick={()=>{
            if(!newCust.name.trim()) return
            setCustomers(prev=>[...prev,{...newCust,id:`CUST-${Date.now()}`,orders:0,totalPurchase:'0.00'}])
            showToast(`✓ ${newCust.name} added!`)
            setShowAdd(false); setNewCust({name:'',phone:'',email:'',address:''})
          }} style={{ padding:'12px', borderRadius:10, fontSize:14 }}>Add Customer</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editCustomer} onClose={()=>setEditCustomer(null)} title="Edit Customer" width={500}>
        {editCustomer && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[['Full Name','name','text'],['Phone Number','phone','tel'],['Email Address','email','email'],['Address','address','text']].map(([label,key,type])=>(
              <div key={key}>
                <label style={{ fontSize:12, color:'#8A7A60', display:'block', marginBottom:6 }}>{label}</label>
                <input className="input-royal" type={type} value={editCustomer[key]||''} onChange={e=>setEditCustomer({...editCustomer,[key]:e.target.value})} style={inputStyle} />
              </div>
            ))}
            <button className="btn-gold" onClick={()=>{
              setCustomers(prev=>prev.map(c=>c.id===editCustomer.id?editCustomer:c))
              showToast(`✓ ${editCustomer.name} updated!`)
              setEditCustomer(null)
            }} style={{ padding:'12px', borderRadius:10, fontSize:14 }}>Save Changes</button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CustomersPage
