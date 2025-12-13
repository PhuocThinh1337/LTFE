import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import PaintEstimatorPage from './pages/PaintEstimatorPage';
import ColorSupportPage from './pages/ColorSupportPage';
function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductsPage />} />

        {/* Category Routes */}
        <Route path="/son-noi-that" element={<ProductsPage category="son-noi-that" />} />
        <Route path="/son-ngoai-that" element={<ProductsPage category="son-ngoai-that" />} />
        <Route path="/son-dan-dung" element={<ProductsPage category="son-dan-dung" />} />
        <Route path="/son-va-chat-phu-cong-nghiep" element={<ProductsPage category="son-va-chat-phu-cong-nghiep" />} />

        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/tinh-toan-luong-son" element={<PaintEstimatorPage />} />
        <Route path="/ho-tro-phoi-mau" element={<ColorSupportPage />} />
      </Routes>
    </Router>
  );
}

export default App;

