import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
                <Navbar />
                <Routes>
                  <Route path="/admin" element={<PrivateRoute adminOnly={true}><Admin /></PrivateRoute>} />               <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                  <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                </Routes>
              </div>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}