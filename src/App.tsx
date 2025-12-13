import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import './App.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import PaintEstimatorPage from './pages/PaintEstimatorPage';
import ColorSupportPage from './pages/ColorSupportPage';
import AuthLoginPage from './pages/AuthLoginPage';
import AuthRegisterPage from './pages/AuthRegisterPage';
import AuthForgotPasswordPage from './pages/AuthForgotPasswordPage';
import CartPage from './pages/cart/CartPage';

function App(): React.JSX.Element {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/san-pham" element={<ProductsPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/tinh-toan-luong-son" element={<PaintEstimatorPage />} />
          <Route path="/paint-estimator" element={<PaintEstimatorPage />} />
          <Route path="/ho-tro-phoi-mau" element={<ColorSupportPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          <Route path="/forgot-password" element={<AuthForgotPasswordPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;