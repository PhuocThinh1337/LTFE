import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { PRODUCTS, Product } from '../data/products';
import '../components/layout/FilterBar.css';

interface ProductsPageProps {
  category?: string;
}

function ProductsPage({ category }: ProductsPageProps): React.JSX.Element {
  // const { category } = useParams<{ category: string }>(); // Removed useParams
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState('Sản phẩm Nippon Paint');

  useEffect(() => {
    let filtered = PRODUCTS;
    let title = 'Sản phẩm Nippon Paint';

    if (category) {
      switch (category) {
        case 'son-noi-that':
          filtered = PRODUCTS.filter(p => p.category === 'Sơn Nội Thất');
          title = 'Sơn Nội Thất';
          break;
        case 'son-ngoai-that':
          filtered = PRODUCTS.filter(p => p.category === 'Sơn Ngoại Thất');
          title = 'Sơn Ngoại Thất';
          break;
        case 'son-dan-dung':
          filtered = PRODUCTS.filter(p => p.category === 'Sơn dân dụng');
          title = 'Sơn Dân Dụng';
          break;
        case 'son-va-chat-phu-cong-nghiep':
          filtered = PRODUCTS.filter(p => p.category === 'Sơn và chất phủ công nghiệp');
          title = 'Sơn và Chất Phủ Công Nghiệp';
          break;
        default:
          // Try to match somewhat loosely or show all
          break;
      }
    }

    setDisplayedProducts(filtered);
    setPageTitle(title);
  }, [category]);

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <section className="np-page-title">
          <div className="np-container">
            <h1>{pageTitle.toUpperCase()}</h1>
            <p className="np-page-subtitle">
              Tìm hiểu thông tin chi tiết về các sản phẩm của chúng tôi.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="np-filter-bar-wrapper">
          <div className="np-container">
            <div className="np-filter-bar">
              <div className="np-filter-group">
                <label>Vị trí:</label>
                <select defaultValue="all">
                  <option value="all">Tất cả</option>
                  <option value="indoor">Trong nhà</option>
                  <option value="outdoor">Ngoài trời</option>
                </select>
              </div>

              <div className="np-filter-group">
                <label>Bề mặt:</label>
                <select defaultValue="all">
                  <option value="all">Tất cả</option>
                  <option value="wall">Tường trát vữa</option>
                  <option value="wood">Gỗ</option>
                  <option value="metal">Kim loại</option>
                </select>
              </div>

              <div className="np-filter-group">
                <label>Loại sản phẩm:</label>
                <select defaultValue="all">
                  <option value="all">Tất cả</option>
                  <option value="topcoat">Sơn phủ</option>
                  <option value="sealer">Sơn lót</option>
                </select>
              </div>

              <button className="np-btn-apply">
                ÁP DỤNG →
              </button>
            </div>
          </div>
        </div>

        <section className="np-products-section">
          <div className="np-container">
            <div className="np-products-grid">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <div key={product.id} className="np-product-card">
                    <div className="np-card-image">
                      <img src={product.image} alt={product.name} />
                      {product.isNew && <span className="np-badge-new">Mới</span>}
                    </div>
                    <div className="np-card-content">
                      <span className="np-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <ul className="np-features-list">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                      <div className="np-product-price" style={{ color: '#e60012', fontWeight: 'bold', margin: '10px 0' }}>
                        {product.price?.toLocaleString('vi-VN')} ₫
                      </div>
                      <button className="np-btn-outline">Xem chi tiết</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductsPage;

