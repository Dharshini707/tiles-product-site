import { useState } from 'react'
import Sidebar       from './components/Sidebar.jsx'
import TopNav        from './components/TopNav.jsx'
import AuthPage      from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProductsPage  from './pages/ProductsPage.jsx'
import SalesPage     from './pages/SalesPage.jsx'
import ReportsPage   from './pages/ReportsPage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import UsersPage     from './pages/UsersPage.jsx'
import CartPage      from './pages/CartPage.jsx'
import ProfilePage   from './pages/ProfilePage.jsx'

import { productsData as initProducts, salesData as initSales, customersData as initCustomers } from './data/mockData.js'

const App = () => {
  const [user,      setUser]      = useState(null)
  const [page,      setPage]      = useState('dashboard')
  const [cart,      setCart]      = useState([])

  // ── Global shared state ─────────────────────────────────────────────────────
  const [products,  setProducts]  = useState(initProducts)
  const [sales,     setSales]     = useState(initSales)
  const [customers, setCustomers] = useState(initCustomers)

  if (!user) return <AuthPage onLogin={setUser} />

  // Update user also updates TopNav avatar & name immediately
  const handleSetUser = (updatedUser) => setUser(updatedUser)

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage setPage={setPage} sales={sales} products={products} customers={customers} />

      case 'products':
        return <ProductsPage cart={cart} setCart={setCart} products={products} setProducts={setProducts} />

      case 'sales':
        return <SalesPage sales={sales} setSales={setSales} products={products} />

      case 'reports':
        return <ReportsPage sales={sales} products={products} />

      case 'customers':
        return <CustomersPage customers={customers} setCustomers={setCustomers} />

      case 'users':
        return <UsersPage />

      case 'cart':
        return <CartPage cart={cart} setCart={setCart} setPage={setPage} />

      case 'profile':
        return (
          <ProfilePage
            user={user}
            setUser={handleSetUser}
            sales={sales}
            products={products}
            customers={customers}
          />
        )

      default:
        return <DashboardPage setPage={setPage} sales={sales} products={products} customers={customers} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#FFFFFF' }}>
      <Sidebar page={page} setPage={setPage} onLogout={() => setUser(null)} user={user} />
      <div style={{ marginLeft:240, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <TopNav page={page} user={user} cartCount={cart.length} setPage={setPage} />
        <main style={{ flex:1, overflowY:'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
