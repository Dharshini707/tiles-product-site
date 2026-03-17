import { useState } from 'react'
import { Modal } from '../components/UI.jsx'
import { IcoPlus, IcoEdit, IcoTrash } from '../components/Icons.jsx'
import { usersData } from '../data/mockData.js'

const UsersPage = () => {
  const [users, setUsers]       = useState(usersData)
  const [editUser, setEditUser] = useState(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [newUser, setNewUser]   = useState({ name:"", email:"", role:"Staff", phone:"", status:"Active" })
  const inputStyle = { padding:"10px 14px", borderRadius:8, fontSize:13, width:"100%" }

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#000000", marginBottom:4 }}>User Management</h2>
          <p style={{ color:"#6B5E4A", fontSize:13 }}>Admin & staff access control</p>
        </div>
        <button className="btn-gold" onClick={()=>setShowAdd(true)} style={{ padding:"10px 20px", borderRadius:10, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
          <IcoPlus size={16}/> Add User
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[{ label:"Total Users", value:users.length },{ label:"Active", value:users.filter(u=>u.status==="Active").length },{ label:"Inactive", value:users.filter(u=>u.status==="Inactive").length }].map((s,i)=>(
          <div key={s.label} className="stat-card fade-up" style={{ borderRadius:12, padding:20, animationDelay:`${i*80}ms`, animationFillMode:"both" }}>
            <p style={{ fontSize:11, color:"#8A7A60", marginBottom:6, textTransform:"uppercase", letterSpacing:".08em" }}>{s.label}</p>
            <p style={{ fontSize:26, fontWeight:700, color:"#8B4513", fontFamily:"'Playfair Display',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="stat-card fade-up" style={{ borderRadius:16, overflow:"hidden" }}>
        <table className="table-royal">
          <thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}>
                <td style={{ color:"#8B4513" }}>{u.id}</td>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#8B4513,#A0522D)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#0F0E0C" }}>{u.name[0]}</div>
                    <span style={{ color:"#000000" }}>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td><span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:u.role==="Admin"?"rgba(139,69,19,.15)":"rgba(93,64,55,.15)", color:u.role==="Admin"?"#8B4513":"#5D4037" }}>{u.role}</span></td>
                <td>{u.phone}</td>
                <td><span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:u.status==="Active"?"rgba(34,197,94,.15)":"rgba(239,68,68,.15)", color:u.status==="Active"?"#22C55E":"#EF4444" }}>● {u.status}</span></td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>setEditUser(u)} style={{ background:"rgba(93,64,55,.1)", border:"none", borderRadius:6, padding:"5px 8px", cursor:"pointer", color:"#5D4037" }}><IcoEdit size={14}/></button>
                    <button onClick={()=>setUsers(prev=>prev.filter(x=>x.id!==u.id))} style={{ background:"rgba(239,68,68,.1)", border:"none", borderRadius:6, padding:"5px 8px", cursor:"pointer", color:"#EF4444" }}><IcoTrash size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add New User" width={480}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {[["Full Name","name","text"],["Email Address","email","email"],["Phone Number","phone","tel"]].map(([label,key,type])=>(
            <div key={key}><label style={{ fontSize:12, color:"#8A7A60", display:"block", marginBottom:6 }}>{label}</label><input className="input-royal" type={type} value={newUser[key]} onChange={e=>setNewUser({...newUser,[key]:e.target.value})} style={inputStyle} /></div>
          ))}
          <div><label style={{ fontSize:12, color:"#8A7A60", display:"block", marginBottom:6 }}>Role</label><select className="input-royal" value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})} style={inputStyle}><option>Admin</option><option>Sales Manager</option><option>Staff</option></select></div>
          <button className="btn-gold" onClick={()=>{ setUsers(prev=>[...prev,{...newUser,id:`USR-00${prev.length+1}`}]); setShowAdd(false); setNewUser({name:"",email:"",role:"Staff",phone:"",status:"Active"}) }} style={{ padding:"12px", borderRadius:10, fontSize:14 }}>Add User</button>
        </div>
      </Modal>

      <Modal open={!!editUser} onClose={()=>setEditUser(null)} title="Edit User" width={480}>
        {editUser && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[["Full Name","name","text"],["Email Address","email","email"],["Phone Number","phone","tel"]].map(([label,key,type])=>(
              <div key={key}><label style={{ fontSize:12, color:"#8A7A60", display:"block", marginBottom:6 }}>{label}</label><input className="input-royal" type={type} value={editUser[key]} onChange={e=>setEditUser({...editUser,[key]:e.target.value})} style={inputStyle} /></div>
            ))}
            <div><label style={{ fontSize:12, color:"#8A7A60", display:"block", marginBottom:6 }}>Role</label><select className="input-royal" value={editUser.role} onChange={e=>setEditUser({...editUser,role:e.target.value})} style={inputStyle}><option>Admin</option><option>Sales Manager</option><option>Staff</option></select></div>
            <div><label style={{ fontSize:12, color:"#8A7A60", display:"block", marginBottom:6 }}>Status</label><select className="input-royal" value={editUser.status} onChange={e=>setEditUser({...editUser,status:e.target.value})} style={inputStyle}><option>Active</option><option>Inactive</option></select></div>
            <button className="btn-gold" onClick={()=>{ setUsers(prev=>prev.map(u=>u.id===editUser.id?editUser:u)); setEditUser(null) }} style={{ padding:"12px", borderRadius:10, fontSize:14 }}>Save Changes</button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default UsersPage
