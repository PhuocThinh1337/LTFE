import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';

function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;

