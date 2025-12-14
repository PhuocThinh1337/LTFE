import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useCart } from '../../contexts/CartContext';
import './CartPage.css';

function CartPage(): React.JSX.Element {
  const { 
    state: { items: cartItems, loading, error }, 
    updateQuantity, 
    removeItem 
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="np-app">
        <Header />
        <main className="np-main" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div>Đang tải giỏ hàng...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="np-app">
        <Header />
        <main className="np-main" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ color: 'red' }}>{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 3000000 ? 0 : 100000; // Miễn phí ship cho đơn > 3 triệu, còn lại 100k
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
  };

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Giỏ hàng' }
          ]}
        />

        <section className="np-page-title">
          <div className="np-container">
            <h1>Giỏ hàng của bạn</h1>
            <p>
              {cartItems.length > 0 
                ? `Bạn có ${cartItems.length} sản phẩm trong giỏ hàng`
                : 'Giỏ hàng của bạn đang trống'
              }
            </p>
          </div>
        </section>

        {cartItems.length > 0 ? (
          <section className="np-cart-section">
            <div className="np-container">
              <div className="np-cart-content">
                {/* Danh sách sản phẩm */}
                <div className="np-cart-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="np-cart-item">
                      <div className="np-cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="np-cart-item-info">
                        <h3>{item.name}</h3>
                        {item.color && <p className="np-cart-item-color">Màu: {item.color}</p>}
                        <p className="np-cart-item-price">{formatPrice(item.price)}</p>
                      </div>
                      
                      <div className="np-cart-item-quantity">
                        <button 
                          className="np-quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                        >
                          -
                        </button>
                        <span className="np-quantity-value">{item.quantity}</span>
                        <button 
                          className="np-quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="np-cart-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      
                      <button 
                        className="np-cart-item-remove"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="np-cart-summary">
                  <div className="np-cart-summary-card">
                    <h3>Tóm tắt đơn hàng</h3>
                    
                    <div className="np-summary-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="np-summary-row">
                      <span>Phí vận chuyển:</span>
                      <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                    </div>
                    
                    {/* Note về chính sách vận chuyển */}
                    {subtotal < 3000000 && (
                      <div className="np-shipping-note">
                        Mua thêm {formatPrice(3000000 - subtotal)} để được miễn phí vận chuyển
                      </div>
                    )}
                    
                    {subtotal >= 3000000 && (
                      <div className="np-shipping-note np-shipping-free">
                        🎉 Đơn hàng của bạn đã được miễn phí vận chuyển!
                      </div>
                    )}
                    
                    <div className="np-summary-divider"></div>
                    
                    <div className="np-summary-row np-summary-total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    
                    <button className="np-btn-primary np-btn-full">
                      Tiến hành thanh toán
                    </button>
                    
                    <button className="np-btn-outline np-btn-full">
                      Tiếp tục mua sắm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="np-empty-cart">
            <div className="np-container">
              <div className="np-empty-cart-content">
                <div className="np-empty-cart-icon">🛒</div>
                <h2>Giỏ hàng trống</h2>
                <p>Hãy khám phá các sản phẩm của chúng tôi và thêm vào giỏ hàng!</p>
                <a href="/san-pham" className="np-btn-primary">
                  Khám phá sản phẩm
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;
