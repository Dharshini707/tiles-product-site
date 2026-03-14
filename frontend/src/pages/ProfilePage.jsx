import { useState, useRef } from 'react'

// ── tiny icon helper ──────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const IcoCamera  = () => <Ico d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z" />
const IcoEdit2   = () => <Ico d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
const IcoLock    = () => <Ico d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" />
const IcoEye2    = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" />
const IcoEyeOff  = () => <Ico d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
const IcoBell2   = () => <Ico d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
const IcoShield  = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
const IcoActivity= () => <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />
const IcoCheck   = () => <Ico d="M20 6L9 17l-5-5" />
const IcoSave    = () => <Ico d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8" />
const IcoPhone   = () => <Ico d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
const IcoMail    = () => <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
const IcoMap     = () => <Ico d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a3 3 0 100-6 3 3 0 000 6" />
const IcoRole    = () => <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />

// ── section header ─────────────────────────────────────────────────────────────
const SectionHead = ({ icon, title, subtitle }) => (
  <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(212,168,83,.15)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(212,168,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4A853' }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#E8DCC8' }}>{title}</p>
        {subtitle && <p style={{ fontSize: 11, color: '#6B5E4A' }}>{subtitle}</p>}
      </div>
    </div>
  </div>
)

// ── field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, icon, children, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, color: '#8A7A60', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', display: 'flex', alignItems: 'center', gap: 5 }}>
      {icon && <span style={{ color: '#D4A853', opacity: .7 }}>{icon}</span>} {label}
    </label>
    {children}
    {error && <span style={{ fontSize: 11, color: '#EF4444' }}>{error}</span>}
  </div>
)

const inp = { padding: '11px 14px', borderRadius: 9, fontSize: 13, width: '100%' }
const sel = { ...inp, appearance: 'none' }

// ── activity mock ─────────────────────────────────────────────────────────────
const activityLog = [
  { action: 'Added product "Marble Luxe"',      time: '2 hours ago',   icon: '📦', color: '#D4A853' },
  { action: 'Created sale ORD-1042',            time: '5 hours ago',   icon: '💰', color: '#22C55E' },
  { action: 'Updated customer Priya Sharma',    time: 'Yesterday',     icon: '👤', color: '#3B82F6' },
  { action: 'Generated report for Q4',          time: '2 days ago',    icon: '📊', color: '#A855F7' },
  { action: 'Deleted product "Old Ceramic"',    time: '3 days ago',    icon: '🗑️', color: '#EF4444' },
  { action: 'Login from Chennai, TN',           time: '3 days ago',    icon: '🔐', color: '#F59E0B' },
  { action: 'Password changed',                 time: '1 week ago',    icon: '🔒', color: '#EAB308' },
  { action: 'Added new customer Arun Kumar',    time: '1 week ago',    icon: '👤', color: '#3B82F6' },
]

// ── stat mini card ─────────────────────────────────────────────────────────────
const MiniStat = ({ label, value, color = '#D4A853' }) => (
  <div style={{ background: 'rgba(212,168,83,.06)', border: '1px solid rgba(212,168,83,.12)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
    <p style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'Playfair Display',serif", marginBottom: 4 }}>{value}</p>
    <p style={{ fontSize: 11, color: '#6B5E4A', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</p>
  </div>
)

// ── MAIN ProfilePage ───────────────────────────────────────────────────────────
const ProfilePage = ({ user, setUser, sales = [], products = [], customers = [] }) => {
  const fileRef = useRef(null)

  // ── profile form state ────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name:     user?.name     || 'Admin User',
    email:    user?.email    || 'admin@royaledge.com',
    phone:    user?.phone    || '+91 9876543210',
    role:     user?.role     || 'Admin',
    address:  user?.address  || 'Chennai, Tamil Nadu',
    bio:      user?.bio      || 'Managing RoyalEdge Tiles operations — products, sales and customer relations.',
    website:  user?.website  || '',
    avatar:   user?.avatar   || '',
  })
  const [editMode,  setEditMode]  = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [errors,    setErrors]    = useState({})

  // ── password state ────────────────────────────────────────────────────────
  const [pwForm,    setPwForm]    = useState({ current: '', newPw: '', confirm: '' })
  const [showPw,    setShowPw]    = useState({ current: false, newPw: false, confirm: false })
  const [pwError,   setPwError]   = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  // ── notifications state ───────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    emailSales:    true,
    emailProducts: false,
    emailReports:  true,
    browserAlerts: true,
    smsAlerts:     false,
    weeklyDigest:  true,
  })

  // ── tab state ─────────────────────────────────────────────────────────────
  const [tab, setTab] = useState('profile')

  // ── avatar upload ─────────────────────────────────────────────────────────
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setProfile(p => ({ ...p, avatar: ev.target.result }))
    reader.readAsDataURL(file)
  }

  // ── save profile ──────────────────────────────────────────────────────────
  const handleSave = () => {
    const e = {}
    if (!profile.name.trim())  e.name  = 'Name is required'
    if (!profile.email.trim()) e.email = 'Email is required'
    if (!profile.phone.trim()) e.phone = 'Phone is required'
    setErrors(e)
    if (Object.keys(e).length) return

    setUser(prev => ({ ...prev, ...profile }))
    setEditMode(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // ── change password ───────────────────────────────────────────────────────
  const handlePasswordChange = () => {
    if (!pwForm.current)                          { setPwError('Current password required'); return }
    if (pwForm.newPw.length < 6)                  { setPwError('New password must be at least 6 characters'); return }
    if (pwForm.newPw !== pwForm.confirm)           { setPwError('Passwords do not match'); return }
    setPwError('')
    setPwSuccess(true)
    setPwForm({ current: '', newPw: '', confirm: '' })
    setTimeout(() => setPwSuccess(false), 4000)
  }

  const set = (k, v) => { setProfile(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  // ── computed stats ────────────────────────────────────────────────────────
  const totalRevenue = sales.reduce((a, s) => a + parseFloat(s.totalAmt || 0), 0)

  const TABS = [
    { id: 'profile',       label: '👤 Profile',       },
    { id: 'security',      label: '🔒 Security',      },
    { id: 'notifications', label: '🔔 Notifications', },
    { id: 'activity',      label: '📋 Activity',      },
  ]

  const roleColor = { Admin: '#D4A853', 'Sales Manager': '#3B82F6', Staff: '#22C55E' }

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>

      {/* ── Toast ── */}
      {saved && (
        <div className="scale-in" style={{ position: 'fixed', top: 80, right: 24, background: 'linear-gradient(135deg,#22C55E,#16A34A)', color: '#fff', padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(34,197,94,.35)' }}>
          <IcoCheck /> Profile updated successfully!
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="fade-up" style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 24, background: 'linear-gradient(135deg, #1A1510 0%, #2A1F0E 50%, #1A1510 100%)', border: '1px solid #2A2418', position: 'relative' }}>
        {/* Decorative pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'repeating-linear-gradient(45deg, #D4A853 0, #D4A853 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,.12) 0%, transparent 70%)' }} />

        <div style={{ padding: '32px 32px 28px', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 28, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', border: '3px solid #D4A853', overflow: 'hidden', background: 'linear-gradient(135deg,#D4A853,#C8965E)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px rgba(212,168,83,.15)' }}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 38, fontWeight: 700, color: '#0F0E0C', fontFamily: "'Playfair Display',serif" }}>
                  {profile.name?.[0]?.toUpperCase() || 'A'}
                </span>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()}
              style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#D4A853', border: '2px solid #141210', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F0E0C' }}>
              <IcoCamera />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: '#E8DCC8', fontWeight: 700 }}>{profile.name}</h2>
              <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `rgba(212,168,83,.15)`, color: roleColor[profile.role] || '#D4A853', border: `1px solid rgba(212,168,83,.25)` }}>
                {profile.role}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { icon: <IcoMail />, val: profile.email },
                { icon: <IcoPhone />, val: profile.phone },
                { icon: <IcoMap />, val: profile.address },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8A7A60', fontSize: 13 }}>
                  <span style={{ color: '#D4A853', opacity: .7 }}>{item.icon}</span>
                  {item.val || '—'}
                </div>
              ))}
            </div>
          </div>

          {/* Edit / Save button */}
          <div style={{ display: 'flex', gap: 10 }}>
            {editMode ? (
              <>
                <button className="btn-outline" onClick={() => { setEditMode(false); setErrors({}) }}
                  style={{ padding: '9px 18px', borderRadius: 9, fontSize: 13 }}>Cancel</button>
                <button className="btn-gold" onClick={handleSave}
                  style={{ padding: '9px 20px', borderRadius: 9, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IcoSave /> Save Profile
                </button>
              </>
            ) : (
              <button className="btn-gold" onClick={() => setEditMode(true)}
                style={{ padding: '9px 20px', borderRadius: 9, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <IcoEdit2 /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(212,168,83,.1)' }}>
          {[
            { label: 'Total Sales',    value: sales.length },
            { label: 'Total Revenue',  value: `₹${(totalRevenue/1000).toFixed(1)}K` },
            { label: 'Products',       value: products.length },
            { label: 'Customers',      value: customers.length },
          ].map((s, i) => (
            <div key={i} style={{ padding: '16px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(212,168,83,.08)' : 'none' }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#D4A853', fontFamily: "'Playfair Display',serif", marginBottom: 3 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#6B5E4A', textTransform: 'uppercase', letterSpacing: '.07em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: '#141210', borderRadius: 12, padding: 5, border: '1px solid #1E1C17' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            style={{ flex: 1, padding: '9px 12px', fontSize: 13 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════
          TAB 1 — PROFILE
      ════════════════════════════════════════ */}
      {tab === 'profile' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Personal Info */}
          <div className="stat-card" style={{ borderRadius: 16, padding: 24 }}>
            <SectionHead icon={<IcoRole />} title="Personal Information" subtitle="Your basic profile details" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Full Name" icon={<IcoRole />} error={errors.name}>
                <input className="input-royal" style={inp}
                  placeholder="Your full name"
                  value={profile.name}
                  onChange={e => set('name', e.target.value)}
                  disabled={!editMode}
                  style={{ ...inp, opacity: editMode ? 1 : .7, cursor: editMode ? 'text' : 'default' }} />
              </Field>

              <Field label="Email Address" icon={<IcoMail />} error={errors.email}>
                <input className="input-royal" type="email"
                  placeholder="email@example.com"
                  value={profile.email}
                  onChange={e => set('email', e.target.value)}
                  disabled={!editMode}
                  style={{ ...inp, opacity: editMode ? 1 : .7, cursor: editMode ? 'text' : 'default' }} />
              </Field>

              <Field label="Phone Number" icon={<IcoPhone />} error={errors.phone}>
                <input className="input-royal"
                  placeholder="+91 XXXXXXXXXX"
                  value={profile.phone}
                  onChange={e => set('phone', e.target.value)}
                  disabled={!editMode}
                  style={{ ...inp, opacity: editMode ? 1 : .7, cursor: editMode ? 'text' : 'default' }} />
              </Field>

              <Field label="Role" icon={<IcoRole />}>
                <select className="input-royal"
                  value={profile.role}
                  onChange={e => set('role', e.target.value)}
                  disabled={!editMode}
                  style={{ ...sel, opacity: editMode ? 1 : .7, cursor: editMode ? 'pointer' : 'default' }}>
                  <option>Admin</option>
                  <option>Sales Manager</option>
                  <option>Staff</option>
                </select>
              </Field>

              <Field label="City / Address" icon={<IcoMap />}>
                <input className="input-royal"
                  placeholder="City, State"
                  value={profile.address}
                  onChange={e => set('address', e.target.value)}
                  disabled={!editMode}
                  style={{ ...inp, opacity: editMode ? 1 : .7, cursor: editMode ? 'text' : 'default' }} />
              </Field>

              <Field label="Website (optional)" icon={<IcoMail />}>
                <input className="input-royal"
                  placeholder="https://yourwebsite.com"
                  value={profile.website}
                  onChange={e => set('website', e.target.value)}
                  disabled={!editMode}
                  style={{ ...inp, opacity: editMode ? 1 : .7, cursor: editMode ? 'text' : 'default' }} />
              </Field>

              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Bio / About" icon={<IcoEdit2 />}>
                  <textarea className="input-royal"
                    placeholder="A short description about yourself..."
                    value={profile.bio}
                    onChange={e => set('bio', e.target.value)}
                    disabled={!editMode}
                    style={{ ...inp, minHeight: 90, resize: 'vertical', lineHeight: 1.7, opacity: editMode ? 1 : .7, cursor: editMode ? 'text' : 'default' }} />
                </Field>
              </div>
            </div>
          </div>

          {/* Avatar section */}
          <div className="stat-card" style={{ borderRadius: 16, padding: 24 }}>
            <SectionHead icon={<IcoCamera />} title="Profile Photo" subtitle="Upload a photo to personalize your account" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #D4A853', overflow: 'hidden', background: 'linear-gradient(135deg,#D4A853,#C8965E)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {profile.avatar
                  ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 28, fontWeight: 700, color: '#0F0E0C' }}>{profile.name?.[0]?.toUpperCase()}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: '#C8B898', marginBottom: 12, lineHeight: 1.6 }}>
                  Upload a profile photo. JPG, PNG or GIF. Max size 2MB.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#D4A853,#C8965E)', color: '#0F0E0C', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
                    <IcoCamera /> Upload Photo
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                  </label>
                  {profile.avatar && (
                    <button onClick={() => setProfile(p => ({ ...p, avatar: '' }))}
                      style={{ padding: '9px 18px', borderRadius: 8, background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.25)', color: '#EF4444', cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Business stats */}
          <div className="stat-card" style={{ borderRadius: 16, padding: 24 }}>
            <SectionHead icon={<IcoActivity />} title="Your Business Stats" subtitle="Summary of your activity on RoyalEdge Tiles" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              <MiniStat label="Sales Created"    value={sales.length}                                              color="#D4A853" />
              <MiniStat label="Total Revenue"    value={`₹${(totalRevenue/1000).toFixed(1)}K`}                    color="#22C55E" />
              <MiniStat label="Products Managed" value={products.length}                                           color="#3B82F6" />
              <MiniStat label="Customers"        value={customers.length}                                          color="#A855F7" />
              <MiniStat label="Completed Orders" value={sales.filter(s=>s.orderStatus==='Completed').length}       color="#22C55E" />
              <MiniStat label="Pending Payments" value={sales.filter(s=>s.paymentStatus==='Pending').length}       color="#EF4444" />
              <MiniStat label="In-Stock Items"   value={products.filter(p=>p.inStock).length}                      color="#D4A853" />
              <MiniStat label="Out of Stock"     value={products.filter(p=>!p.inStock).length}                     color="#EAB308" />
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB 2 — SECURITY
      ════════════════════════════════════════ */}
      {tab === 'security' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Change Password */}
          <div className="stat-card" style={{ borderRadius: 16, padding: 24 }}>
            <SectionHead icon={<IcoLock />} title="Change Password" subtitle="Use a strong password with letters, numbers and symbols" />

            {pwSuccess && (
              <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#22C55E', fontSize: 13, fontWeight: 500 }}>
                <IcoCheck /> Password changed successfully!
              </div>
            )}
            {pwError && (
              <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#EF4444', fontSize: 13 }}>
                {pwError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
              {[
                { label: 'Current Password',  key: 'current' },
                { label: 'New Password',      key: 'newPw'   },
                { label: 'Confirm Password',  key: 'confirm' },
              ].map(({ label, key }) => (
                <Field key={key} label={label} icon={<IcoLock />}>
                  <div style={{ position: 'relative' }}>
                    <input className="input-royal"
                      type={showPw[key] ? 'text' : 'password'}
                      placeholder={label}
                      value={pwForm[key]}
                      onChange={e => { setPwForm(p => ({ ...p, [key]: e.target.value })); setPwError('') }}
                      style={{ ...inp, paddingRight: 44 }} />
                    <button onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B5E4A', cursor: 'pointer' }}>
                      {showPw[key] ? <IcoEyeOff /> : <IcoEye2 />}
                    </button>
                  </div>
                </Field>
              ))}

              {/* Password strength bar */}
              {pwForm.newPw && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#8A7A60' }}>Password strength</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: pwForm.newPw.length < 6 ? '#EF4444' : pwForm.newPw.length < 10 ? '#EAB308' : '#22C55E' }}>
                      {pwForm.newPw.length < 6 ? 'Weak' : pwForm.newPw.length < 10 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div style={{ height: 4, background: '#1E1C17', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${Math.min(100, (pwForm.newPw.length / 12) * 100)}%`, background: pwForm.newPw.length < 6 ? '#EF4444' : pwForm.newPw.length < 10 ? '#EAB308' : '#22C55E', transition: 'all .3s' }} />
                  </div>
                </div>
              )}

              <button className="btn-gold" onClick={handlePasswordChange}
                style={{ padding: '12px', borderRadius: 9, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <IcoLock /> Update Password
              </button>
            </div>
          </div>

          {/* Security overview */}
          <div className="stat-card" style={{ borderRadius: 16, padding: 24 }}>
            <SectionHead icon={<IcoShield />} title="Security Overview" subtitle="Your account security status" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Two-Factor Authentication', status: 'Not Enabled',  enabled: false, action: 'Enable 2FA'   },
                { label: 'Last Password Change',      status: '7 days ago',   enabled: true,  action: null           },
                { label: 'Active Sessions',           status: '1 device',     enabled: true,  action: 'Manage'       },
                { label: 'Login History',             status: 'Chennai, TN',  enabled: true,  action: 'View History' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(212,168,83,.04)', border: '1px solid rgba(212,168,83,.08)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.enabled ? '#22C55E' : '#EF4444' }} />
                    <div>
                      <p style={{ fontSize: 13, color: '#E8DCC8', fontWeight: 500 }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: '#6B5E4A' }}>{item.status}</p>
                    </div>
                  </div>
                  {item.action && (
                    <button className="btn-outline" style={{ padding: '5px 14px', borderRadius: 7, fontSize: 12 }}>{item.action}</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ background: 'rgba(239,68,68,.04)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: '#EF4444', marginBottom: 6 }}>Danger Zone</h3>
            <p style={{ fontSize: 13, color: '#8A7A60', marginBottom: 18 }}>These actions are irreversible. Please be careful.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ padding: '10px 20px', borderRadius: 9, background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.3)', color: '#EF4444', cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>
                Deactivate Account
              </button>
              <button style={{ padding: '10px 20px', borderRadius: 9, background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.4)', color: '#EF4444', cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB 3 — NOTIFICATIONS
      ════════════════════════════════════════ */}
      {tab === 'notifications' && (
        <div className="fade-up stat-card" style={{ borderRadius: 16, padding: 24 }}>
          <SectionHead icon={<IcoBell2 />} title="Notification Preferences" subtitle="Choose how and when you want to be notified" />

          {/* Email notifications */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, color: '#D4A853', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>📧 Email Notifications</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'emailSales',    label: 'New sale created',            desc: 'Get notified when a new sale is added' },
                { key: 'emailProducts', label: 'Product stock updates',        desc: 'Alerts when products go out of stock' },
                { key: 'emailReports',  label: 'Weekly report summary',        desc: 'Receive automated weekly performance reports' },
                { key: 'weeklyDigest',  label: 'Weekly business digest',       desc: 'Summary of the week\'s key metrics' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(212,168,83,.04)', border: '1px solid rgba(212,168,83,.08)', borderRadius: 10, transition: 'all .2s' }}>
                  <div>
                    <p style={{ fontSize: 13, color: '#E8DCC8', fontWeight: 500, marginBottom: 3 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: '#6B5E4A' }}>{item.desc}</p>
                  </div>
                  {/* Toggle */}
                  <div onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                    style={{ width: 44, height: 24, borderRadius: 12, background: notifs[item.key] ? '#D4A853' : '#2A2418', cursor: 'pointer', position: 'relative', transition: 'background .3s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: notifs[item.key] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: notifs[item.key] ? '#0F0E0C' : '#4A3E2C', transition: 'left .3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser / SMS */}
          <div>
            <p style={{ fontSize: 12, color: '#D4A853', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>📱 Browser & SMS Alerts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'browserAlerts', label: 'Browser push notifications', desc: 'Show desktop alerts in your browser' },
                { key: 'smsAlerts',     label: 'SMS alerts',                  desc: 'Receive critical alerts via SMS' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(212,168,83,.04)', border: '1px solid rgba(212,168,83,.08)', borderRadius: 10 }}>
                  <div>
                    <p style={{ fontSize: 13, color: '#E8DCC8', fontWeight: 500, marginBottom: 3 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: '#6B5E4A' }}>{item.desc}</p>
                  </div>
                  <div onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                    style={{ width: 44, height: 24, borderRadius: 12, background: notifs[item.key] ? '#D4A853' : '#2A2418', cursor: 'pointer', position: 'relative', transition: 'background .3s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: notifs[item.key] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: notifs[item.key] ? '#0F0E0C' : '#4A3E2C', transition: 'left .3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(42,36,24,.5)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-gold" style={{ padding: '10px 24px', borderRadius: 9, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IcoSave /> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB 4 — ACTIVITY
      ════════════════════════════════════════ */}
      {tab === 'activity' && (
        <div className="fade-up stat-card" style={{ borderRadius: 16, padding: 24 }}>
          <SectionHead icon={<IcoActivity />} title="Activity Log" subtitle="Your recent actions on RoyalEdge Tiles" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activityLog.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: i < activityLog.length - 1 ? '1px solid rgba(42,36,24,.5)' : 'none', alignItems: 'flex-start' }}>
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 40 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${log.color}18`, border: `1.5px solid ${log.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {log.icon}
                  </div>
                  {i < activityLog.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(42,36,24,.6)', marginTop: 6, minHeight: 16 }} />}
                </div>
                <div style={{ flex: 1, paddingTop: 6 }}>
                  <p style={{ fontSize: 13, color: '#E8DCC8', fontWeight: 500, marginBottom: 3 }}>{log.action}</p>
                  <p style={{ fontSize: 11, color: '#6B5E4A' }}>{log.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load more */}
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button className="btn-outline" style={{ padding: '9px 28px', borderRadius: 9, fontSize: 13 }}>Load More Activity</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
