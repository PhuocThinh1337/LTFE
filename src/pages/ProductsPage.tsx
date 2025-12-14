import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { PRODUCTS } from '../data/products';
import { Link } from 'react-router-dom';

interface ProductsPageProps {
  category?: string;
}

function ProductsPage({ category }: ProductsPageProps): React.JSX.Element {

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


  // Filter products based on category prop, or show all if no category
  const filteredProducts = category
    ? PRODUCTS.filter(p => p.category === category)
    : PRODUCTS;

  const getCategoryTitle = (cat?: string) => {
    switch (cat) {
      case 'son-noi-that': return 'SƠN NỘI THẤT';
      case 'son-ngoai-that': return 'SƠN NGOẠI THẤT';
      case 'son-dan-dung': return 'SƠN DÂN DỤNG';
      case 'son-va-chat-phu-cong-nghiep': return 'SƠN VÀ CHẤT PHỦ CÔNG NGHIỆP';
      default: return 'SẢN PHẨM NIPPON PAINT';
    }
  };

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        {/* Simple Page Title Section */}
        <section className="np-page-title" style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="np-container">
            <h1 style={{ fontSize: '32px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', color: '#0046ad' }}>
              {getCategoryTitle(category)}
            </h1>
            <p style={{ margin: '0 auto', fontSize: '16px', color: '#666' }}>
              Kiến tạo giá trị bền vững thông qua sản phẩm Nippon chất lượng cao
            </p>
          </div>
        </section>

        <section className="np-products-section" style={{ padding: '40px 0 80px' }}>
          <div className="np-container">
            <div className="np-products-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {filteredProducts.map(product => (
                <div key={product.id} className="np-product-card" style={{
                  background: '#fff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease',
                  border: '1px solid #eee',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Card Actions */}
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

                  <div style={{ height: '240px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', position: 'relative' }}>
                    <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    {product.isNew && (
                      <span style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        background: '#e60012',
                        color: 'white',
                        fontSize: '10px',
                        padding: '4px 8px',
                        borderRadius: '50%',
                        fontWeight: '700',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}>
                        MỚI
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '20px', background: '#f9f9f9', borderTop: '1px solid #eee', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 10px', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', height: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {product.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <strong style={{ color: '#d32f2f', fontSize: '16px' }}>
                        {product.price.toLocaleString('vi-VN')} ₫
                      </strong>
                      <button style={{
                        background: 'transparent',
                        border: '1px solid #d32f2f',
                        color: '#d32f2f',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}>
                        Xem ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Không tìm thấy sản phẩm nào trong danh mục này.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductsPage;

