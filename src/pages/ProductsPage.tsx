import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { PRODUCTS, Product } from '../data/products';
import '../components/layout/FilterBar.css';

interface ProductsPageProps {
  category?: string;
}

function ProductsPage({ category }: ProductsPageProps): React.JSX.Element {
  // State for filtering and display
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState('Sản phẩm Nippon Paint');

  // State for wishlist
  const [wishlistIds, setWishlistIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlistIds(JSON.parse(stored));
    }
  }, []);

  const toggleWishlist = (id: number) => {
    let newIds;
    if (wishlistIds.includes(id)) {
      newIds = wishlistIds.filter(wid => wid !== id);
    } else {
      newIds = [...wishlistIds, id];
    }
    setWishlistIds(newIds);
    localStorage.setItem('wishlist', JSON.stringify(newIds));
  };

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
          // Try simple match if not in switch
          filtered = PRODUCTS.filter(p => p.category === category);
          title = category.toUpperCase().replace(/-/g, ' ');
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
        {/* Dynamic Breadcrumb based on category */}
        <Breadcrumb items={[
          { label: 'Trang chủ', link: '/' },
          { label: 'Sản phẩm', link: '/san-pham' },
          ...(category ? [{ label: pageTitle }] : [])
        ]} />

        <section className="np-page-title">
          <div className="np-container">
            <h1>{pageTitle.toUpperCase()}</h1>
            <p className="np-page-subtitle">
              Kiến tạo giá trị bền vững thông qua sản phẩm Nippon chất lượng cao
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
                  <div key={product.id} className="np-product-card" style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Card Actions (Compare & Wishlist) */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      zIndex: 2,
                      pointerEvents: 'none' /* Allow clicks to pass through spacer */
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#e5e7eb',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#4b5563',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        pointerEvents: 'auto'
                      }}>
                        <span style={{
                          width: '14px',
                          height: '14px',
                          border: '1px solid currentColor',
                          borderRadius: '50%',
                          display: 'block'
                        }}></span>
                        SO SÁNH
                      </div>
                      <div
                        onClick={() => toggleWishlist(product.id)}
                        style={{
                          cursor: 'pointer',
                          color: wishlistIds.includes(product.id) ? '#e60012' : '#374151',
                          pointerEvents: 'auto',
                          transition: 'color 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={wishlistIds.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    </div>

                    <div className="np-card-image" style={{ position: 'relative' }}>
                      <img src={product.image} alt={product.name} />
                      {product.isNew && <span className="np-badge-new">Mới</span>}
                    </div>
                    <div className="np-card-content">
                      <span className="np-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>

                      {/* Features List (Optional, from card design) */}
                      {product.features && (
                        <ul className="np-features-list">
                          {product.features.slice(0, 2).map((feature, idx) => (
                            <li key={idx}>• {feature}</li>
                          ))}
                        </ul>
                      )}

                      <div className="np-product-price" style={{ color: '#e60012', fontWeight: 'bold', margin: '10px 0' }}>
                        {product.price?.toLocaleString('vi-VN')} ₫
                      </div>
                      <button className="np-btn-outline">Xem chi tiết</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', gridColumn: 'span 3' }}>
                  <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
                </div>
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

