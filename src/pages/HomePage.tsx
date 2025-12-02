import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function HomePage(): React.JSX.Element {
  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <section className="np-hero">
          <div className="np-container">
            <h1>Chào mừng đến với Nippon Paint Việt Nam</h1>
            <p>Kiến tạo giá trị bền vững thông qua sản phẩm Nippon</p>
            <div className="np-hero-actions">
              <Link to="/san-pham" className="np-btn-primary">
                Khám phá sản phẩm
              </Link>
              <Link to="/lien-he" className="np-btn-outline">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </section>

        <section className="np-features">
          <div className="np-container">
            <h2>Khám phá bộ sưu tập màu sắc của chúng tôi</h2>
            <div className="np-features-grid">
              <div className="np-feature-card">
                <h3>2338+ Mã Màu</h3>
                <p>Thỏa sức lựa chọn màu sắc cho không gian sống</p>
              </div>
              <div className="np-feature-card">
                <h3>Công Cụ Phối Màu</h3>
                <p>Chọn màu sắc từ thư viện với hơn 2000 mã màu sơn</p>
              </div>
              <div className="np-feature-card">
                <h3>Xu Hướng Màu Sắc</h3>
                <p>Cập nhật những xu hướng màu sắc mới nhất</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;

