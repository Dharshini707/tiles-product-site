import { useState, useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { StatCard } from '../components/UI.jsx'
import { IcoSales, IcoReport, IcoProd, IcoCust, IcoPlus } from '../components/Icons.jsx'
import { PIE_COLORS } from '../data/mockData.js'

// ── Helper: format currency ───────────────────────────────────────────────────
const fmtCurrency = (num) => {
  if (num >= 100000)  return `₹${(num/100000).toFixed(1)}L`
  if (num >= 1000)    return `₹${(num/1000).toFixed(1)}K`
  return `₹${num.toFixed(0)}`
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const DashboardPage = ({ setPage, sales = [], products = [], customers = [] }) => {
  const [chartType, setChartType] = useState('bar')

  // ── Live computed stats ───────────────────────────────────────────────────
  const totalRevenue    = useMemo(() => sales.reduce((a,s) => a + parseFloat(s.totalAmt||0), 0), [sales])
  const totalOrders     = sales.length
  const outOfStock      = products.filter(p => !p.inStock).length
  const totalCustomers  = customers.length

  // ── Monthly sales chart from real sales data ──────────────────────────────
  const monthlySalesChart = useMemo(() => {
    const map = {}
    MONTHS.forEach(m => { map[m] = { month: m, sales: 0, orders: 0 } })
    sales.forEach(s => {
      const d = s.orderDate ? new Date(s.orderDate) : null
      if (!d || isNaN(d)) return
      const mon = MONTHS[d.getMonth()]
      if (map[mon]) {
        map[mon].sales  += parseFloat(s.totalAmt || 0)
        map[mon].orders += 1
      }
    })
    return Object.values(map)
  }, [sales])

  // ── Top selling products from real sales data ─────────────────────────────
  const topSellingProducts = useMemo(() => {
    const map = {}
    sales.forEach(s => {
      if (!s.product) return
      if (!map[s.product]) map[s.product] = { name: s.product, sales: 0, value: 0 }
      map[s.product].sales += parseInt(s.qty || 0)
      map[s.product].value += parseFloat(s.totalAmt || 0)
    })
    return Object.values(map)
      .sort((a,b) => b.sales - a.sales)
      .slice(0, 5)
  }, [sales])

  // ── Recent sales (latest 5) ────────────────────────────────────────────────
  const recentSales = useMemo(() =>
    [...sales].sort((a,b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0,5)
  , [sales])

  // ── This month vs last month revenue ──────────────────────────────────────
  const now       = new Date()
  const thisMonth = MONTHS[now.getMonth()]
  const lastMonth = MONTHS[now.getMonth() === 0 ? 11 : now.getMonth() - 1]
  const thisMonthRev = monthlySalesChart.find(m => m.month === thisMonth)?.sales || 0
  const lastMonthRev = monthlySalesChart.find(m => m.month === lastMonth)?.sales || 0
  const revGrowth = lastMonthRev > 0
    ? `${thisMonthRev >= lastMonthRev ? '↑' : '↓'} ${Math.abs(((thisMonthRev - lastMonthRev)/lastMonthRev)*100).toFixed(0)}% vs last month`
    : 'No previous month data'

  const completedOrders = sales.filter(s => s.orderStatus === 'Completed').length
  const orderGrowth     = totalOrders > 0
    ? `${completedOrders} completed`
    : '0 completed'

  return (
    <div style={{ padding:24 }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:'#111827', marginBottom:4 }}>Business Overview</h2>
        <p style={{ color:'#6B7280', fontSize:13 }}>Live data — updates as you add products, sales and customers.</p>
      </div>

      {/* ── Live Stat Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard
          label="Total Revenue"
          value={fmtCurrency(totalRevenue)}
          sub={revGrowth}
          icon={<IcoSales size={22}/>}
          delay={0}
        />
        <StatCard
          label="Total Orders"
          value={totalOrders}
          sub={orderGrowth}
          icon={<IcoReport size={22}/>}
          delay={100}
        />
        <StatCard
          label="Products"
          value={products.length}
          sub={`${outOfStock} out of stock`}
          icon={<IcoProd size={22}/>}
          delay={200}
        />
        <StatCard
          label="Customers"
          value={totalCustomers}
          sub={`${customers.length} registered`}
          icon={<IcoCust size={22}/>}
          delay={300}
        />
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:24 }}>

        {/* Sales Chart */}
        <div className="stat-card fade-up" style={{ borderRadius:16, padding:24, animationDelay:'100ms', animationFillMode:'both' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#111827', marginBottom:2 }}>Sales Overview</h3>
              <p style={{ fontSize:11, color:'#6B7280' }}>Monthly revenue from live sales data</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {['bar','line'].map(t => (
                <button key={t} className={`tab-btn ${chartType===t?'active':''}`}
                  style={{ padding:'5px 14px', fontSize:12 }} onClick={() => setChartType(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {chartType === 'bar' ? (
              <BarChart data={monthlySalesChart}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B4513"/>
                    <stop offset="100%" stopColor="#A0522D" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={11} tickFormatter={v => v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip
                  contentStyle={{ background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:8, color:'#111827', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="sales" fill="url(#goldGrad)" radius={[4,4,0,0]} />
              </BarChart>
            ) : (
              <LineChart data={monthlySalesChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={11} tickFormatter={v => v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip
                  contentStyle={{ background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:8, color:'#111827', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="sales" stroke="#8B4513" strokeWidth={2.5} dot={{ fill:'#8B4513', r:4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Top Products Pie */}
        <div className="stat-card fade-up" style={{ borderRadius:16, padding:24, animationDelay:'200ms', animationFillMode:'both' }}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#111827', marginBottom:2 }}>Top Products</h3>
            <p style={{ fontSize:11, color:'#6B7280' }}>By units sold</p>
          </div>
          {topSellingProducts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={topSellingProducts} dataKey="sales" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={72}>
                    {topSellingProducts.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:8, color:'#111827', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={v => [`${v} units`, 'Sold']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:12 }}>
                {topSellingProducts.slice(0,4).map((p,i) => (
                  <div key={p.name} style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#6B7280' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:PIE_COLORS[i % PIE_COLORS.length], flexShrink:0 }} />
                      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:100 }}>{p.name}</span>
                    </div>
                    <span style={{ color:'#8B4513', fontWeight:600 }}>{p.sales}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:180, color:'#9CA3AF' }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📊</div>
              <p style={{ fontSize:12 }}>No sales data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16 }}>

        {/* Recent Sales */}
        <div className="stat-card fade-up" style={{ borderRadius:16, padding:24, animationDelay:'300ms', animationFillMode:'both' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#111827' }}>Recent Sales</h3>
            <button className="btn-outline" onClick={() => setPage('sales')} style={{ padding:'6px 14px', borderRadius:6, fontSize:12 }}>View All</button>
          </div>
          {recentSales.length > 0 ? (
            <table className="table-royal">
              <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentSales.map(s => (
                  <tr key={s.id}>
                    <td style={{ color:'#8B4513' }}>{s.id}</td>
                    <td>{s.customer}</td>
                    <td style={{ maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.product}</td>
                    <td style={{ color:'#22C55E', fontWeight:600 }}>₹{s.totalAmt}</td>
                    <td>
                      <span style={{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                        background: s.orderStatus==='Completed'?'rgba(34,197,94,.15)':s.orderStatus==='Processing'?'rgba(234,179,8,.15)':'rgba(239,68,68,.15)',
                        color: s.orderStatus==='Completed'?'#22C55E':s.orderStatus==='Processing'?'#EAB308':'#EF4444' }}>
                        {s.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:120, color:'#9CA3AF' }}>
              <p style={{ fontSize:14 }}>No sales recorded yet.</p>
              <button className="btn-gold" onClick={() => setPage('sales')} style={{ marginTop:12, padding:'8px 18px', borderRadius:8, fontSize:13 }}>Create First Sale</button>
            </div>
          )}
        </div>

        {/* Quick Actions + Top Sellers */}
        <div className="stat-card fade-up" style={{ borderRadius:16, padding:24, animationDelay:'400ms', animationFillMode:'both' }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#111827', marginBottom:16 }}>Quick Actions</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
            {[
              { label:'Add New Product',  icon:<IcoPlus/>,   pg:'products' },
              { label:'Create Sale',      icon:<IcoSales/>,  pg:'sales' },
              { label:'View Reports',     icon:<IcoReport/>, pg:'reports' },
              { label:'Manage Customers', icon:<IcoCust/>,   pg:'customers' },
            ].map(a => (
              <button key={a.label} onClick={() => setPage(a.pg)}
                style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(139,69,19,.05)', border:'1px solid rgba(139,69,19,.15)', borderRadius:10, padding:'12px 16px', cursor:'pointer', color:'#374151', fontSize:13, fontFamily:"'Outfit',sans-serif", transition:'all .3s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(139,69,19,.1)'; e.currentTarget.style.color='#8B4513' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(139,69,19,.05)'; e.currentTarget.style.color='#374151' }}>
                <span style={{ color:'#8B4513' }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>

          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:'#111827', marginBottom:12 }}>Top Sellers</h3>
          {topSellingProducts.length > 0 ? topSellingProducts.slice(0,3).map((p,i) => (
            <div key={p.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:i<2?'1px solid #E5E7EB':'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#8B4513' }}>#{i+1}</span>
                <span style={{ fontSize:12, color:'#4B5563', maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
              </div>
              <span style={{ fontSize:11, color:'#6B7280' }}>{p.sales} units</span>
            </div>
          )) : (
            <p style={{ fontSize:12, color:'#9CA3AF' }}>No sales yet to rank.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
