import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import SupportMegaMenu from './SupportMegaMenu';

import { useCart } from '../../contexts/CartContext';


function Header(): React.JSX.Element {
  const location = useLocation();
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const itemCount = state.items.length;
  const isActive = (path: string): string => {
    return location.pathname === path ? 'active-link' : '';
  };

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="np-header">
      <div className="np-header-top">
        <div className="np-container np-header-top-inner">
          <Link to="/" className="np-logo">
            <span className="np-logo-mark">NP</span>
            <span className="np-logo-text">
              Nippon <span>Paint</span>
            </span>
          </Link>

          <nav className="np-quick-links">
            <a href="#projects">Khách hàng dự án</a>
            <a href="#support">Hỗ trợ</a>
            <Link to="/lien-he#store">Tìm đại lý</Link>
          </nav>

          <div className="np-lang-hotline">
            <div className="np-lang-switcher">
              <button className="active">Tiếng Việt</button>
              <button>English</button>
            </div>
            <div className="np-hotline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Hotline:</span>
              <strong>1800 6111</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="np-header-nav-wrapper">
        <div className="np-container np-header-nav">
          <button
            className="np-mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          <nav className={`np-main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className={isActive('/')} onClick={() => setMobileMenuOpen(false)}>
              Trang chủ
            </Link>
            <a href="#colors" onClick={() => setMobileMenuOpen(false)}>Màu sắc</a>
            <div
              className={`np-nav-item-wrapper ${isProductsMenuOpen ? 'open' : ''}`}
              onMouseEnter={() => setIsProductsMenuOpen(true)}
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
              <div
                className={`np-nav-trigger ${isActive('/san-pham')}`}
              >
                Sản phẩm <span className="np-nav-arrow">▼</span>
              </div>
              <MegaMenu active={isProductsMenuOpen} onClose={() => setIsProductsMenuOpen(false)} />
            </div>
            <a href="#business" onClick={() => setMobileMenuOpen(false)}>Lĩnh vực kinh doanh</a>
            <div
              className={`np-nav-item-wrapper ${isSupportMenuOpen ? 'open' : ''}`}
              onMouseEnter={() => setIsSupportMenuOpen(true)}
              onMouseLeave={() => setIsSupportMenuOpen(false)}
            >
              <div
                className={`np-nav-trigger ${isActive('/tinh-toan-luong-son') || isActive('/ho-tro-phoi-mau') ? 'active-link' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                Hỗ trợ <span className="np-nav-arrow">▼</span>
              </div>
              <SupportMegaMenu active={isSupportMenuOpen} onClose={() => setIsSupportMenuOpen(false)} />
            </div>
            <Link to="/lien-he" className={isActive('/lien-he')} onClick={() => setMobileMenuOpen(false)}>
              Liên hệ
            </Link>
          </nav>

          <div className="np-header-actions">
            <Link to="/yeu-thich" className="np-action-icon" title="Yêu thích">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>
            <Link to="/gio-hang" className="np-cart-btn" title="Giỏ hàng">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && itemCount < 100 && (
                <span className="np-cart-count">{itemCount}</span>
              )}
              {itemCount >= 100 && (
                <span className="np-cart-count">99+</span>
              )}
            </Link>

            <Link to="/login" className="np-login-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;