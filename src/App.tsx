import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import PaintEstimatorPage from './pages/PaintEstimatorPage';
import ColorSupportPage from './pages/ColorSupportPage';
import WishlistPage from './pages/WishlistPage';
import AuthLoginPage from './pages/AuthLoginPage';
import AuthRegisterPage from './pages/AuthRegisterPage';
import AuthForgotPasswordPage from './pages/AuthForgotPasswordPage';
import CartPage from './pages/cart/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';


function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/san-pham" element={<ProductsPage />} />
            <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
            <Route path="/lien-he" element={<ContactPage />} />

            <Route path="/tinh-toan-luong-son" element={<PaintEstimatorPage />} />
            <Route path="/ho-tro-phoi-mau" element={<ColorSupportPage />} />

            <Route path="/son-noi-that" element={<ProductsPage category="son-noi-that" />} />
            <Route path="/son-ngoai-that" element={<ProductsPage category="son-ngoai-that" />} />
            <Route path="/son-dan-dung" element={<ProductsPage category="son-dan-dung" />} />
            <Route path="/son-va-chat-phu-cong-nghiep" element={<ProductsPage category="son-va-chat-phu-cong-nghiep" />} />



            <Route path="/yeu-thich" element={<WishlistPage />} />
            <Route path="/gio-hang" element={<CartPage />} />
            <Route path="/lich-su-mua-hang" element={<OrderHistoryPage />} />
            <Route path="/thanh-toan" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<AuthLoginPage />} />
            <Route path="/register" element={<AuthRegisterPage />} />
            <Route path="/forgot-password" element={<AuthForgotPasswordPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;