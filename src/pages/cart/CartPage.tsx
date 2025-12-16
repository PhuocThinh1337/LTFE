import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // State để track sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Khởi tạo tất cả sản phẩm được chọn khi load
  useEffect(() => {
    const allIds = new Set(cartItems.map(item => item.id));
    setSelectedItems(allIds);
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Tính toán chỉ cho sản phẩm được chọn
  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = selectedItems.size === 0 ? 0 : (subtotal > 3000000 ? 0 : 100000); // Miễn phí ship cho đơn > 3 triệu, còn lại 100k. Nếu không chọn sản phẩm nào thì ship = 0
  const total = subtotal + shipping;

  // Toggle chọn/bỏ chọn sản phẩm
  const toggleItemSelection = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // Chọn tất cả
  const selectAllItems = () => {
    const allIds = new Set(cartItems.map(item => item.id));
    setSelectedItems(allIds);
  };

  // Bỏ chọn tất cả
  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
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
                  {/* Header với checkbox select all */}
                  <div className="np-cart-header">
                    <div className="np-select-all">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectAllItems();
                          } else {
                            deselectAllItems();
                          }
                        }}
                        className="np-checkbox"
                      />
                      <span>Chọn tất cả ({cartItems.length})</span>
                    </div>
                  </div>

                  {cartItems.map(item => (
                    <div key={item.id} className="np-cart-item">
                      {/* Checkbox cho từng item */}
                      <div className="np-item-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="np-checkbox"
                        />
                      </div>
                      
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
                      <span>
                        {selectedItems.size === 0 
                          ? '0 VND' 
                          : (shipping === 0 
                            ? 'Miễn phí (đơn > 3 triệu)' 
                            : formatPrice(shipping) + ' (đơn < 3 triệu)'
                          )
                        }
                      </span>
                    </div>
                    
                    {/* Note về chính sách vận chuyển */}
                    {subtotal < 3000000 && selectedItems.size > 0 && (
                      <div className="np-shipping-note">
                        Mua thêm {formatPrice(3000000 - subtotal)} để được miễn phí vận chuyển
                      </div>
                    )}
                    
                    {subtotal >= 3000000 && selectedItems.size > 0 && (
                      <div className="np-shipping-note np-shipping-free">
                        Đơn hàng của bạn đã được miễn phí vận chuyển!
                      </div>
                    )}
                    
                    <div className="np-summary-divider"></div>
                    
                    <div className="np-summary-row np-summary-total">
                      <span>Tổng cộng ({selectedItems.size} sản phẩm):</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    
                    <button 
                      className="git np-btn-primary np-btn-full"
                      disabled={selectedItems.size === 0}
                      onClick={() => {
                        if (selectedItems.size > 0) {
                          // TODO: Navigate to checkout với selected items
                          navigate('/thanh-toan', {
                            state: {
                              selectedItems: selectedCartItems,
                              subtotal,
                              shipping,
                              total
                            }
                          });
                        }
                      }}
                    >
                      {selectedItems.size === 0 
                        ? 'Vui lòng chọn sản phẩm' 
                        : `Thanh toán `
                      }
                    </button>
                    
                    <button 
                      className="np-btn-outline np-btn-full"
                      onClick={() => navigate('/san-pham')}
                    >
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
                <div className="np-empty-cart-icon">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
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
