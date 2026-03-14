import { IcoDash, IcoProd, IcoSales, IcoReport, IcoCust, IcoUser, IcoLogout, IcoTile } from './Icons.jsx'

const IcoProfile = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
)

const Sidebar = ({ page, setPage, onLogout, user }) => {
  const items = [
    { id:'dashboard', label:'Dashboard', icon:<IcoDash /> },
    { id:'products',  label:'Products',  icon:<IcoProd /> },
    { id:'sales',     label:'Sales',     icon:<IcoSales /> },
    { id:'reports',   label:'Reports',   icon:<IcoReport /> },
    { id:'customers', label:'Customers', icon:<IcoCust /> },
    { id:'users',     label:'Users',     icon:<IcoUser /> },
  ]

  return (
    <aside style={{ width:240, background:'#0F0E0C', borderRight:'1px solid #1E1C17', display:'flex', flexDirection:'column', position:'fixed', left:0, top:0, bottom:0, zIndex:200 }}>
      {/* Logo */}
      <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid #1E1C17' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="float-anim" style={{ width:36, height:36, background:'linear-gradient(135deg,#D4A853,#C8965E)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IcoTile color="#0F0E0C" />
          </div>
          <div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:'#D4A853' }}>RoyalEdge</p>
            <p style={{ fontSize:10, color:'#6B5E4A', letterSpacing:'.08em' }}>TILES</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
        <p style={{ padding:'8px 20px', fontSize:10, color:'#4A3E2C', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:4 }}>Main Menu</p>
        {items.map(item => (
          <div key={item.id}
            className={`sidebar-item ${page===item.id ? 'active' : ''}`}
            onClick={() => setPage(item.id)}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', color:page===item.id?'#D4A853':'#8A7A60' }}>
            <span style={{ opacity:page===item.id?1:.7 }}>{item.icon}</span>
            <span style={{ fontSize:14, fontWeight:page===item.id?600:400 }}>{item.label}</span>
            {page===item.id && <span style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#D4A853' }} />}
          </div>
        ))}
      </nav>

      {/* Profile mini card + Profile link + Logout */}
      <div style={{ borderTop:'1px solid #1E1C17' }}>
        {/* Profile card — clickable */}
        <div onClick={() => setPage('profile')}
          style={{ margin:'12px 12px 0', padding:'12px 14px', borderRadius:12, background: page==='profile'?'rgba(212,168,83,.12)':'rgba(212,168,83,.05)', border:`1px solid ${page==='profile'?'rgba(212,168,83,.4)':'rgba(212,168,83,.12)'}`, cursor:'pointer', transition:'all .25s', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#D4A853,#C8965E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#0F0E0C', flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:13, color:'#E8DCC8', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name||'Admin'}</p>
            <p style={{ fontSize:10, color:'#6B5E4A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.role||'Admin'}</p>
          </div>
          <IcoProfile />
        </div>

        {/* Logout */}
        <div className="sidebar-item" onClick={onLogout}
          style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', margin:'4px 0 8px', color:'#EF4444' }}>
          <IcoLogout />
          <span style={{ fontSize:14 }}>Logout</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
