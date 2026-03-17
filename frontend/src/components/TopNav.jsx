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
  <header style={{ background:'rgba(255,255,255,0.8)', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(10px)' }}>
    <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, background:'linear-gradient(135deg,#8B4513,#CD853F)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
      {PAGE_TITLES[page] || page.charAt(0).toUpperCase()+page.slice(1)}
    </h1>

    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      {/* Search */}
      <div style={{ position:'relative' }}>
        <input className="input-royal" placeholder="Search..."
          style={{ padding:'8px 12px 8px 36px', borderRadius:8, fontSize:13, width:200 }} />
        <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }}>
          <IcoSearch size={16}/>
        </span>
      </div>

      {/* Cart */}
      <button onClick={() => setPage('cart')}
        style={{ background:'rgba(139,69,19,.05)', border:'1px solid rgba(139,69,19,.2)', borderRadius:8, padding:'8px 12px', color:'#8B4513', cursor:'pointer', position:'relative', display:'flex', alignItems:'center' }}>
        <IcoCart />
        {cartCount > 0 && (
          <span style={{ position:'absolute', top:-6, right:-6, background:'#8B4513', color:'#FFFFFF', borderRadius:'50%', width:18, height:18, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {cartCount}
          </span>
        )}
      </button>

      {/* Bell */}
      <button style={{ background:'rgba(139,69,19,.05)', border:'1px solid rgba(139,69,19,.2)', borderRadius:8, padding:'8px 12px', color:'#8B4513', cursor:'pointer' }}>
        <IcoBell />
      </button>

      {/* Avatar — click to go to profile */}
      <div onClick={() => setPage('profile')}
        style={{ display:'flex', alignItems:'center', gap:8, background: page==='profile'?'rgba(139,69,19,.1)':'transparent', padding:'6px 12px', borderRadius:8, border:`1px solid ${page==='profile'?'rgba(139,69,19,.3)':'transparent'}`, cursor:'pointer', transition:'all .25s' }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(139,69,19,.05)'; e.currentTarget.style.borderColor='rgba(139,69,19,.2)' }}
        onMouseLeave={e => { if(page!=='profile'){ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' } }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#8B4513,#A0522D)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#FFFFFF', overflow:'hidden' }}>
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : user?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <p style={{ fontSize:13, color:'#374151', fontWeight:500, lineHeight:1.2 }}>{user?.name||'Admin'}</p>
          <p style={{ fontSize:10, color:'#6B7280' }}>{user?.role||'Admin'}</p>
        </div>
      </div>
    </div>
  </header>
)

export default TopNav
