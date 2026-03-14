import { IcoSearch, IcoBell, IcoCart } from './Icons.jsx'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  products:  'Products',
  sales:     'Sales',
  reports:   'Reports',
  customers: 'Customers',
  users:     'Users',
  cart:      'Cart',
  profile:   'My Profile',
}

const TopNav = ({ page, user, cartCount, setPage }) => (
  <header style={{ background:'#141210', borderBottom:'1px solid #2A2418', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(10px)' }}>
    <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, background:'linear-gradient(135deg,#D4A853,#F0C97A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
      {PAGE_TITLES[page] || page.charAt(0).toUpperCase()+page.slice(1)}
    </h1>

    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      {/* Search */}
      <div style={{ position:'relative' }}>
        <input className="input-royal" placeholder="Search..."
          style={{ padding:'8px 12px 8px 36px', borderRadius:8, fontSize:13, width:200 }} />
        <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#6B5E4A' }}>
          <IcoSearch size={16}/>
        </span>
      </div>

      {/* Cart */}
      <button onClick={() => setPage('cart')}
        style={{ background:'rgba(212,168,83,.1)', border:'1px solid rgba(212,168,83,.3)', borderRadius:8, padding:'8px 12px', color:'#D4A853', cursor:'pointer', position:'relative', display:'flex', alignItems:'center' }}>
        <IcoCart />
        {cartCount > 0 && (
          <span style={{ position:'absolute', top:-6, right:-6, background:'#D4A853', color:'#0F0E0C', borderRadius:'50%', width:18, height:18, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {cartCount}
          </span>
        )}
      </button>

      {/* Bell */}
      <button style={{ background:'rgba(212,168,83,.1)', border:'1px solid rgba(212,168,83,.3)', borderRadius:8, padding:'8px 12px', color:'#D4A853', cursor:'pointer' }}>
        <IcoBell />
      </button>

      {/* Avatar — click to go to profile */}
      <div onClick={() => setPage('profile')}
        style={{ display:'flex', alignItems:'center', gap:8, background: page==='profile'?'rgba(212,168,83,.16)':'rgba(212,168,83,.08)', padding:'6px 12px', borderRadius:8, border:`1px solid ${page==='profile'?'rgba(212,168,83,.5)':'rgba(212,168,83,.2)'}`, cursor:'pointer', transition:'all .25s' }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(212,168,83,.16)'; e.currentTarget.style.borderColor='rgba(212,168,83,.4)' }}
        onMouseLeave={e => { if(page!=='profile'){ e.currentTarget.style.background='rgba(212,168,83,.08)'; e.currentTarget.style.borderColor='rgba(212,168,83,.2)' } }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#D4A853,#C8965E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#0F0E0C', overflow:'hidden' }}>
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : user?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <p style={{ fontSize:13, color:'#C8B898', fontWeight:500, lineHeight:1.2 }}>{user?.name||'Admin'}</p>
          <p style={{ fontSize:10, color:'#6B5E4A' }}>{user?.role||'Admin'}</p>
        </div>
      </div>
    </div>
  </header>
)

export default TopNav
