import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { CompareProvider } from './contexts/CompareContext';
import CompareFloatingBar from './components/common/CompareFloatingBar';
import './App.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import PaintEstimatorPage from './pages/PaintEstimatorPage';
import ColorSupportPage from './pages/ColorSupportPage';
import CustomColorPage from './pages/CustomColorPage';
import WishlistPage from './pages/WishlistPage';
import AuthLoginPage from './pages/AuthLoginPage';
import AuthRegisterPage from './pages/AuthRegisterPage';
import AuthForgotPasswordPage from './pages/AuthForgotPasswordPage';
import CartPage from './pages/cart/CartPage';
import OrderHistoryPage from './pages/order-history/OrderHistoryPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparePage from './pages/CompareProductPage';
import LiveStreamPage from './pages/LiveStreamPage';
import VoucherPage from './pages/voucher/VoucherPage';
import MyVouchersPage from './pages/voucher/MyVouchersPage';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <Router>
            <CompareFloatingBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/san-pham" element={<ProductsPage />} />
              <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
              <Route path="/lien-he" element={<ContactPage />} />

              <Route path="/tinh-toan-luong-son" element={<PaintEstimatorPage />} />
              <Route path="/ho-tro-phoi-mau" element={<ColorSupportPage />} />
              <Route path="/phoi-mau-tuy-chinh" element={<CustomColorPage />} />
              <Route path="/so-sanh/san-pham" element={<ComparePage />} />

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
              <Route path="/live-stream" element={<LiveStreamPage />} />
              <Route path="/ma-giam-gia" element={<VoucherPage />} />
              <Route path="/voucher-cua-toi" element={<MyVouchersPage />} />
            </Routes>
          </Router>
        </CompareProvider>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;