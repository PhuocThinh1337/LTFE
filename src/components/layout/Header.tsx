import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MegaMenu from './MegaMenu';

function Header(): React.JSX.Element {
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

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

            {/* Mega Menu Trigger */}
            <div
              className="np-nav-item-wrapper"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <div className={`np-nav-trigger ${location.pathname.includes('/san-pham') || isMegaMenuOpen ? 'active-link' : ''}`}>
                Sản phẩm
                <span className={`np-nav-arrow ${isMegaMenuOpen ? 'open' : ''}`}>▼</span>
              </div>
              <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
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

