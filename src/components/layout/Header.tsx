import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import SupportMegaMenu from './SupportMegaMenu';
import Avatar from '../common/Avatar';
import './header.css';

import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTS } from '../../data/products';


function Header(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Filter products for live search
  const filteredProducts = searchTerm.trim()
    ? PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5) // Limit to 5 results
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSearchResults(false);
      navigate(`/san-pham?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const itemCount = state.items.length;
  const isActive = (path: string): string => {
    return location.pathname === path ? 'active-link' : '';
  };

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
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
            <Link to="/phoi-mau-tuy-chinh" className={isActive('/phoi-mau-tuy-chinh')} onClick={() => setMobileMenuOpen(false)}>
              Phối màu tùy chỉnh
            </Link>
            <div
              className={`np-nav-item-wrapper ${isProductsMenuOpen ? 'open' : ''}`}
            >
              <div
                className={`np-nav-trigger ${isActive('/san-pham')}`}
                onClick={() => setIsProductsMenuOpen(!isProductsMenuOpen)}
                style={{ cursor: 'pointer' }}
              >
                Sản phẩm <span className="np-nav-arrow">▼</span>
              </div>
              <MegaMenu active={isProductsMenuOpen} onClose={() => setIsProductsMenuOpen(false)} />
            </div>
            <a href="#business" onClick={() => setMobileMenuOpen(false)}>Lĩnh vực kinh doanh</a>
            <div
              className={`np-nav-item-wrapper ${isSupportMenuOpen ? 'open' : ''}`}
            >
              <div
                className={`np-nav-trigger ${isActive('/tinh-toan-luong-son') || isActive('/ho-tro-phoi-mau') ? 'active-link' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsSupportMenuOpen(!isSupportMenuOpen)}
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

            {/* Live Search Bar */}
            <div className="np-search-wrapper" onMouseLeave={() => setShowSearchResults(false)}>
              <form onSubmit={handleSearchSubmit} className="np-search-form">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(true)}
                  className="np-search-input"
                />
                <button type="submit" className="np-search-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchTerm.trim() && (
                <>
                  {/* Invisible bridge to prevent mouseleave when crossing margin */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    height: '20px',
                    zIndex: 1004,
                    background: 'transparent'
                  }} />
                  <div className="np-search-results">

                    {filteredProducts.length > 0 ? (
                      <>
                        {filteredProducts.map(product => (
                          <Link
                            key={product.id}
                            to={`/san-pham/${product.slug}`}
                            className="np-search-item"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <img src={product.image} alt={product.name} />
                            <div className="np-search-item-info">
                              <div className="np-search-item-name">{product.name}</div>
                              <div className="np-search-item-price">
                                {product.price.toLocaleString('vi-VN')} ₫
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="np-search-view-all" onClick={handleSearchSubmit}>
                          Xem tất cả kết quả cho "{searchTerm}"
                        </div>
                      </>
                    ) : (
                      <div className="np-search-no-results">
                        Không tìm thấy sản phẩm nào.
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>

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

            {isAuthenticated && user ? (
              <div
                className="np-user-menu-wrapper"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="np-user-btn">
                  <Avatar
                    name={user.name}
                    avatar={user.avatar}
                    size="small"
                    className="np-user-avatar-circle"
                  />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <>
                    <div className="np-user-dropdown-bridge"></div>
                    <div className="np-user-dropdown" onMouseEnter={() => setIsUserMenuOpen(true)}>
                      <div className="np-user-info">
                        <div className="np-user-info-name">{user.name}</div>
                        <div className="np-user-info-email">{user.email}</div>
                      </div>
                      <div className="np-user-divider"></div>
                      <Link to="/profile" className="np-user-menu-item" onClick={() => setIsUserMenuOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Thông tin tài khoản</span>
                      </Link>
                      <Link to="/lich-su-mua-hang" className="np-user-menu-item" onClick={() => setIsUserMenuOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                          <path d="M9 14l2 2 4-4" />
                        </svg>
                        <span>Lịch sử mua hàng</span>
                      </Link>
                      <button className="np-user-menu-item" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="np-login-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;