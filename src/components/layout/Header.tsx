import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MegaMenu from './MegaMenu';

function Header(): React.JSX.Element {
  const location = useLocation();
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  const isActive = (path: string): string => {
    return location.pathname === path ? 'active-link' : '';
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
              <span>Hotline miễn phí:</span>
              <strong>1800 6111</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="np-header-nav-wrapper">
        <div className="np-container np-header-nav">
          <nav className="np-main-nav">
            <Link to="/" className={isActive('/')}>
              Trang chủ
            </Link>
            <a href="#colors">Màu sắc</a>
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
            <a href="#business">Lĩnh vực kinh doanh</a>
            <a href="#support">Hỗ trợ</a>
            <Link to="/lien-he" className={isActive('/lien-he')}>
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

