import React from 'react';
import { Link } from 'react-router-dom';

function Footer(): React.JSX.Element {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="np-footer">
      <div className="np-container np-footer-content">
        <div className="np-footer-main">
          <div className="np-footer-section">
            <div className="np-logo footer-logo">
              <span className="np-logo-mark">NP</span>
              <span className="np-logo-text">
                NIPPON <span>PAINT</span>
              </span>
            </div>
            <p className="np-footer-description">
              Nhà sản xuất sơn hàng đầu tại Việt Nam với hơn 140 năm kinh nghiệm, mang đến giải pháp sơn chất lượng cao cho mọi công trình.
            </p>
            <div className="np-footer-social">
              <a href="#" className="np-social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="np-social-icon" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="#" className="np-social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="np-social-icon" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="np-footer-section">
            <h3 className="np-footer-title">Sản phẩm</h3>
            <ul className="np-footer-links">
              <li><Link to="/san-pham">Sơn nội thất</Link></li>
              <li><Link to="/san-pham">Sơn ngoại thất</Link></li>
              <li><Link to="/san-pham">Sơn chuyên dụng</Link></li>
              <li><Link to="/san-pham">Phụ kiện sơn</Link></li>
            </ul>
          </div>

          <div className="np-footer-section">
            <h3 className="np-footer-title">Dịch vụ</h3>
            <ul className="np-footer-links">
              <li><Link to="/tinh-toan-luong-son">Tính toán lượng sơn</Link></li>
              <li><Link to="/ho-tro-phoi-mau">Hỗ trợ phối màu</Link></li>
              <li><Link to="/tim-dai-ly">Tìm đại lý</Link></li>
              <li><a href="#support">Hỗ trợ kỹ thuật</a></li>
            </ul>
          </div>

          <div className="np-footer-section">
            <h3 className="np-footer-title">Liên hệ</h3>
            <div className="np-footer-contact">
              <div className="np-footer-hotline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div>
                  <span className="np-footer-hotline-label">Hotline miễn phí</span>
                  <a href="tel:18006111" className="np-footer-hotline-number">1800 6111</a>
                </div>
              </div>
              <Link to="/lien-he" className="np-footer-contact-btn">
                <span>Liên hệ ngay</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.333 2h9.334C13.403 2 14 2.597 14 3.333v9.334c0 .736-.597 1.333-1.333 1.333H3.333C2.597 14 2 13.403 2 12.667V3.333C2 2.597 2.597 2 3.333 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M5 6l6 4-6 4V6z" fill="currentColor"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="np-footer-bottom">
          <p className="np-footer-copyright">
            © 2024 Nippon Paint Việt Nam. Bảo lưu mọi quyền.
          </p>
          <div className="np-footer-legal">
            <Link to="/terms">Điều khoản sử dụng</Link>
            <Link to="/privacy">Chính sách bảo mật</Link>
            <Link to="/sitemap">Sơ đồ trang web</Link>
          </div>
        </div>

        <button className="np-scroll-to-top" onClick={scrollToTop} aria-label="Lên đầu trang">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
