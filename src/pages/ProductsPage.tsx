import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { PRODUCTS } from '../data/products';
import { Link } from 'react-router-dom';

interface ProductsPageProps {
  category?: string;
}

function ProductsPage({ category }: ProductsPageProps): React.JSX.Element {

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
                  border: '1px solid #eee'
                }}>
                  <div style={{ height: '240px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                    <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '20px', background: '#f9f9f9', borderTop: '1px solid #eee' }}>
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

