import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';


function Header(): React.JSX.Element {
  const location = useLocation();
  const { getTotalItems } = useCart(); 
  
  const totalItems = getTotalItems(); 

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
            <Link to="/san-pham" className={isActive('/san-pham')}>
              Sản phẩm
            </Link>
            <a href="#business">Lĩnh vực kinh doanh</a>
            <a href="#support">Hỗ trợ</a>
            <Link to="/lien-he" className={isActive('/lien-he')}>
              Liên hệ
            </Link>
          </nav>
          <div className="np-header-actions">
            <Link to="/gio-hang" className="np-cart-btn">
              <i className="fas fa-shopping-cart np-cart-icon"></i>
              {totalItems > 0 && totalItems < 100 && (
                <span className="np-cart-count">{totalItems}</span>
              )}
              {totalItems >= 100 && (
                <span className="np-cart-count">99+</span>
              )}
            </Link>
            <Link to="/login" className="np-login-btn">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

