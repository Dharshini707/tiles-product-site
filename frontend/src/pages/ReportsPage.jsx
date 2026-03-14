import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import { IcoDownload, IcoPrint, IcoFilter } from '../components/Icons.jsx'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const fmtCurrency = (n) => {
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n/1000).toFixed(1)}K`
  return `₹${n.toFixed(0)}`
}

const LabeledField = ({ label, children }) => (
  <div>
    <label style={{ fontSize:11, color:'#8A7A60', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</label>
    {children}
  </div>
)

const ReportsPage = ({ sales = [], products = [] }) => {

  // ── Filter state ────────────────────────────────────────────────────────────
  const [dateFrom,       setDateFrom]       = useState('')
  const [dateTo,         setDateTo]         = useState('')
  const [filterProduct,  setFilterProduct]  = useState('')
  const [filterCustomer, setFilterCustomer] = useState('')
  const [filterPayment,  setFilterPayment]  = useState('')
  const [filterStatus,   setFilterStatus]   = useState('')

  // ── Unique customer list from sales ────────────────────────────────────────
  const customerList = useMemo(() =>
    [...new Set(sales.map(s => s.customer).filter(Boolean))], [sales])

  // ── Product list from products prop ────────────────────────────────────────
  const productList = useMemo(() =>
    [...new Set(products.map(p => p.name))], [products])

  // ── Apply filters ───────────────────────────────────────────────────────────
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const sDate = s.orderDate ? new Date(s.orderDate) : null

      if (dateFrom && sDate && sDate < new Date(dateFrom)) return false
      if (dateTo   && sDate && sDate > new Date(dateTo))   return false

      if (filterProduct  && s.product       !== filterProduct)  return false
      if (filterCustomer && s.customer      !== filterCustomer) return false
      if (filterPayment  && s.paymentMethod !== filterPayment)  return false
      if (filterStatus   && s.orderStatus   !== filterStatus)   return false

      return true
    })
  }, [sales, dateFrom, dateTo, filterProduct, filterCustomer, filterPayment, filterStatus])

  const handleClear = () => {
    setDateFrom(''); setDateTo('')
    setFilterProduct(''); setFilterCustomer('')
    setFilterPayment(''); setFilterStatus('')
  }

  // ── Computed summary from filtered data ────────────────────────────────────
  const totalRevenue   = filteredSales.reduce((a,s) => a + parseFloat(s.totalAmt||0), 0)
  const totalOrders    = filteredSales.length
  const avgOrderVal    = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const completedCount = filteredSales.filter(s => s.orderStatus === 'Completed').length

  // ── Monthly chart from filtered data ───────────────────────────────────────
  const monthlyChart = useMemo(() => {
    const map = {}
    MONTHS.forEach(m => { map[m] = { month:m, sales:0, orders:0 } })
    filteredSales.forEach(s => {
      const d = s.orderDate ? new Date(s.orderDate) : null
      if (!d || isNaN(d)) return
      const mon = MONTHS[d.getMonth()]
      if (map[mon]) {
        map[mon].sales  += parseFloat(s.totalAmt || 0)
        map[mon].orders += 1
      }
    })
    return Object.values(map)
  }, [filteredSales])

  // ── Top products chart from filtered data ──────────────────────────────────
  const topProductsChart = useMemo(() => {
    const map = {}
    filteredSales.forEach(s => {
      if (!s.product) return
      if (!map[s.product]) map[s.product] = { name:s.product, sales:0, revenue:0 }
      map[s.product].sales   += parseInt(s.qty || 0)
      map[s.product].revenue += parseFloat(s.totalAmt || 0)
    })
    return Object.values(map).sort((a,b) => b.sales - a.sales).slice(0,6)
  }, [filteredSales])

  const inpStyle = { padding:'9px 14px', borderRadius:8, fontSize:13 }
  const selStyle = { ...inpStyle, appearance:'none' }

  return (
    <div style={{ padding:24 }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#E8DCC8', marginBottom:4 }}>Analytics & Reports</h2>
          <p style={{ color:'#6B5E4A', fontSize:13 }}>
            {filteredSales.length} of {sales.length} records
            {(dateFrom||dateTo||filterProduct||filterCustomer||filterPayment||filterStatus) && (
              <span style={{ color:'#D4A853', marginLeft:8, fontWeight:600 }}>— Filters Active</span>
            )}
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn-outline" style={{ padding:'9px 16px', borderRadius:10, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
            <IcoDownload size={14}/> Export PDF
          </button>
          <button className="btn-gold" style={{ padding:'9px 16px', borderRadius:10, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
            <IcoDownload size={14}/> Export Excel
          </button>
          <button className="btn-outline" style={{ padding:'9px 14px', borderRadius:10 }}>
            <IcoPrint size={14}/>
          </button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div className="stat-card fade-up" style={{ borderRadius:16, padding:20, marginBottom:24 }}>
        <p style={{ fontSize:12, color:'#D4A853', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16 }}>
          🔍 Filter Reports
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14, alignItems:'end' }}>

          <LabeledField label="From Date">
            <input type="date" className="input-royal" value={dateFrom}
              onChange={e => setDateFrom(e.target.value)} style={inpStyle} />
          </LabeledField>

          <LabeledField label="To Date">
            <input type="date" className="input-royal" value={dateTo}
              onChange={e => setDateTo(e.target.value)} style={inpStyle} />
          </LabeledField>

          <LabeledField label="Product">
            <select className="input-royal" value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)} style={selStyle}>
              <option value="">All Products</option>
              {productList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </LabeledField>

          <LabeledField label="Customer">
            <select className="input-royal" value={filterCustomer}
              onChange={e => setFilterCustomer(e.target.value)} style={selStyle}>
              <option value="">All Customers</option>
              {customerList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </LabeledField>

          <LabeledField label="Payment Method">
            <select className="input-royal" value={filterPayment}
              onChange={e => setFilterPayment(e.target.value)} style={selStyle}>
              <option value="">All Methods</option>
              {['Cash','UPI','Card','Online','Bank Transfer'].map(m => <option key={m}>{m}</option>)}
            </select>
          </LabeledField>

          <LabeledField label="Order Status">
            <select className="input-royal" value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
              <option value="">All Statuses</option>
              {['Completed','Processing','Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
          </LabeledField>
        </div>

        {/* Active filter chips + clear */}
        <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap', alignItems:'center' }}>
          {[
            dateFrom       && { label:`From: ${dateFrom}`,       clear:()=>setDateFrom('') },
            dateTo         && { label:`To: ${dateTo}`,           clear:()=>setDateTo('') },
            filterProduct  && { label:`Product: ${filterProduct}`,   clear:()=>setFilterProduct('') },
            filterCustomer && { label:`Customer: ${filterCustomer}`, clear:()=>setFilterCustomer('') },
            filterPayment  && { label:`Payment: ${filterPayment}`,   clear:()=>setFilterPayment('') },
            filterStatus   && { label:`Status: ${filterStatus}`,     clear:()=>setFilterStatus('') },
          ].filter(Boolean).map((chip,i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(212,168,83,.12)', border:'1px solid rgba(212,168,83,.3)', color:'#D4A853', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:500 }}>
              {chip.label}
              <button onClick={chip.clear} style={{ background:'none', border:'none', color:'#D4A853', cursor:'pointer', fontSize:14, lineHeight:1, padding:0 }}>×</button>
            </span>
          ))}
          {(dateFrom||dateTo||filterProduct||filterCustomer||filterPayment||filterStatus) && (
            <button onClick={handleClear}
              style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', color:'#EF4444', padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
              Clear All ×
            </button>
          )}
          {(!dateFrom&&!dateTo&&!filterProduct&&!filterCustomer&&!filterPayment&&!filterStatus) && (
            <span style={{ fontSize:11, color:'#4A3E2C' }}>No filters applied — showing all {sales.length} records</span>
          )}
        </div>
      </div>

      {/* ── Summary Cards (live) ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Revenue',   value: fmtCurrency(totalRevenue), raw: `₹${totalRevenue.toLocaleString('en-IN', {minimumFractionDigits:2})}` },
          { label:'Total Orders',    value: totalOrders },
          { label:'Avg Order Value', value: fmtCurrency(avgOrderVal) },
          { label:'Completed',       value: completedCount },
        ].map((s,i) => (
          <div key={s.label} className="stat-card fade-up"
            style={{ borderRadius:12, padding:20, animationDelay:`${i*80}ms`, animationFillMode:'both' }}>
            <p style={{ fontSize:11, color:'#8A7A60', marginBottom:6, textTransform:'uppercase', letterSpacing:'.08em' }}>{s.label}</p>
            <p style={{ fontSize:26, fontWeight:700, color:'#D4A853', fontFamily:"'Playfair Display',serif" }}>{s.value}</p>
            {s.raw && <p style={{ fontSize:10, color:'#4A3E2C', marginTop:2 }}>{s.raw}</p>}
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16, marginBottom:24 }}>

        {/* Monthly Revenue Bar */}
        <div className="stat-card" style={{ borderRadius:16, padding:24 }}>
          <div style={{ marginBottom:20 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#E8DCC8', marginBottom:2 }}>Monthly Sales Revenue</h3>
            <p style={{ fontSize:11, color:'#6B5E4A' }}>Based on filtered data</p>
          </div>
          {filteredSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyChart}>
                <defs>
                  <linearGradient id="goldGrad4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A853"/>
                    <stop offset="100%" stopColor="#C8965E" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1C17" />
                <XAxis dataKey="month" stroke="#6B5E4A" fontSize={11} />
                <YAxis stroke="#6B5E4A" fontSize={11} tickFormatter={v => v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip
                  contentStyle={{ background:'#1A1814', border:'1px solid #2A2418', borderRadius:8, color:'#E8DCC8' }}
                  formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="sales" fill="url(#goldGrad4)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:220, color:'#4A3E2C', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:32 }}>📉</div>
              <p style={{ fontSize:13 }}>No data matches current filters</p>
            </div>
          )}
        </div>

        {/* Top Products Horizontal Bar */}
        <div className="stat-card" style={{ borderRadius:16, padding:24 }}>
          <div style={{ marginBottom:20 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#E8DCC8', marginBottom:2 }}>Top Selling Products</h3>
            <p style={{ fontSize:11, color:'#6B5E4A' }}>By units sold in filtered range</p>
          </div>
          {topProductsChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProductsChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1C17" />
                <XAxis type="number" stroke="#6B5E4A" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#6B5E4A" fontSize={10} width={90}
                  tickFormatter={v => v.length > 12 ? v.slice(0,12)+'…' : v} />
                <Tooltip
                  contentStyle={{ background:'#1A1814', border:'1px solid #2A2418', borderRadius:8, color:'#E8DCC8' }}
                  formatter={v => [`${v} units`, 'Sold']}
                />
                <Bar dataKey="sales" fill="#D4A853" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:220, color:'#4A3E2C', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:32 }}>📦</div>
              <p style={{ fontSize:13 }}>No product data</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sales Report Table ── */}
      <div className="stat-card" style={{ borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid #1E1C17', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#E8DCC8', marginBottom:2 }}>Sales Report Table</h3>
            <p style={{ fontSize:11, color:'#6B5E4A' }}>{filteredSales.length} records shown</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-outline" style={{ padding:'6px 14px', borderRadius:8, fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
              <IcoDownload size={12}/> PDF
            </button>
            <button className="btn-gold" style={{ padding:'6px 14px', borderRadius:8, fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
              <IcoDownload size={12}/> Excel
            </button>
          </div>
        </div>

        {filteredSales.length > 0 ? (
          <div style={{ overflowX:'auto' }}>
            <table className="table-royal">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Product</th>
                  <th>Qty</th><th>Price/Unit</th><th>Discount</th>
                  <th>Total</th><th>Payment</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(s => (
                  <tr key={s.id}>
                    <td style={{ color:'#D4A853', fontWeight:600 }}>{s.id}</td>
                    <td>{s.customer}</td>
                    <td>{s.product}</td>
                    <td style={{ textAlign:'center' }}>{s.qty}</td>
                    <td>₹{s.pricePerUnit}</td>
                    <td style={{ color:'#22C55E' }}>{s.discount}%</td>
                    <td style={{ color:'#22C55E', fontWeight:600 }}>₹{s.totalAmt}</td>
                    <td>{s.paymentMethod}</td>
                    <td>
                      <span style={{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                        background: s.orderStatus==='Completed'?'rgba(34,197,94,.15)':s.orderStatus==='Processing'?'rgba(234,179,8,.15)':'rgba(239,68,68,.15)',
                        color: s.orderStatus==='Completed'?'#22C55E':s.orderStatus==='Processing'?'#EAB308':'#EF4444' }}>
                        {s.orderStatus}
                      </span>
                    </td>
                    <td style={{ fontSize:12 }}>{s.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48, color:'#4A3E2C' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <p style={{ fontSize:15, color:'#6B5E4A', marginBottom:6 }}>No records match your filters</p>
            <p style={{ fontSize:12, color:'#4A3E2C', marginBottom:16 }}>Try adjusting or clearing the filters above</p>
            <button onClick={handleClear}
              style={{ background:'rgba(212,168,83,.1)', border:'1px solid rgba(212,168,83,.3)', color:'#D4A853', padding:'8px 20px', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:500 }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsPage
