import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';

function ProductsPage(): React.JSX.Element {
  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Sản phẩm' }
          ]}
        />

        <section className="np-page-title">
          <div className="np-container">
            <h1>Sản phẩm Nippon Paint</h1>
            <p>
              Kiến tạo giá trị bền vững thông qua sản phẩm Nippon chất lượng cao
            </p>
          </div>
        </section>

        <section className="np-products-section">
          <div className="np-container">
            <div className="np-products-grid">
              <div className="np-product-card">
                <h3>Sơn Nippon Spot-less Plus</h3>
                <p>
                  Dòng sơn phủ nội thất cao cấp sử dụng công nghệ chống bám bẩn và công nghệ Ion
                  bạc
                </p>
                <button className="np-btn-outline">Xem chi tiết</button>
              </div>

              <div className="np-product-card">
                <h3>Sơn Nippon WeatherGard Plus+</h3>
                <p>
                  Dòng sơn nước ngoại thất cao cấp với độ bền ấn tượng, khả năng chống bám bụi và
                  chống thấm nước
                </p>
                <button className="np-btn-outline">Xem chi tiết</button>
              </div>

              <div className="np-product-card">
                <h3>Sơn Nippon Trắng Trần Toàn Diện</h3>
                <p>
                  EASY WASH là sơn nội thất cao cấp với tính năng dễ lau chùi vượt trội
                </p>
                <button className="np-btn-outline">Xem chi tiết</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductsPage;

