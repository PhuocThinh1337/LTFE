import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useCart } from '../../contexts/CartContext';
import { VOUCHERS, Voucher } from '../../data/vouchers';
import './CartPage.css';

function CartPage(): React.JSX.Element {
  const {
    state: { items: cartItems, loading, error, appliedVoucher, discountAmount },
    updateQuantity,
    removeItem,
    applyVoucher,
    removeVoucher
  } = useCart();
  const navigate = useNavigate();

  // State để track sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Voucher state
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showMyVouchers, setShowMyVouchers] = useState(false);
  const [myVouchers, setMyVouchers] = useState<Voucher[]>([]);
  const myVouchersRef = useRef<HTMLDivElement>(null);

  // Khởi tạo tất cả sản phẩm được chọn khi load
  useEffect(() => {
    const allIds = new Set(cartItems.map(item => item.id));
    setSelectedItems(allIds);
  }, [cartItems]);

  // Load vouchers từ "Voucher của tôi"
  useEffect(() => {
    const saved = localStorage.getItem('savedVouchers');
    if (saved) {
      const savedIds: number[] = JSON.parse(saved);
      const vouchers = VOUCHERS.filter(v => savedIds.includes(v.id));
      // Chỉ hiển thị voucher còn hiệu lực và còn lượt dùng
      const now = new Date();
      const validVouchers = vouchers.filter(v => {
        const endDate = new Date(v.endDate);
        return v.isActive && endDate >= now && v.usedCount < v.usageLimit;
      });
      setMyVouchers(validVouchers);
    }
  }, []);

  // Đóng dropdown khi click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (myVouchersRef.current && !myVouchersRef.current.contains(event.target as Node)) {
        setShowMyVouchers(false);
      }
    }

    if (showMyVouchers) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMyVouchers]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Tính toán chỉ cho sản phẩm được chọn
  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = selectedItems.size === 0 ? 0 : (subtotal > 3000000 ? 0 : 100000);

  // Tính discount
  const effectiveDiscount = Math.min(discountAmount, subtotal);
  const total = Math.max(0, subtotal + shipping - effectiveDiscount);

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

  // Xử lý Voucher
  const handleApplyVoucher = () => {
    if (!couponCode.trim()) return;
    setCouponMessage(null);
    const result = applyVoucher(couponCode);
    if (result.success) {
      setCouponMessage({ type: 'success', text: result.message });
      setCouponCode('');
      setShowMyVouchers(false);
    } else {
      setCouponMessage({ type: 'error', text: result.message });
    }
  };

  const handleSelectVoucher = (voucher: Voucher) => {
    setCouponCode(voucher.code);
    setShowMyVouchers(false);
    // Tự động áp dụng voucher
    setCouponMessage(null);
    const result = applyVoucher(voucher.code);
    if (result.success) {
      setCouponMessage({ type: 'success', text: result.message });
      setCouponCode('');
    } else {
      setCouponMessage({ type: 'error', text: result.message });
    }
  };

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.value}%`;
    } else {
      return `${voucher.value.toLocaleString('vi-VN')} ₫`;
    }
  };

  const handleRemoveVoucher = () => {
    removeVoucher();
    setCouponMessage(null);
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

                    {/* Voucher Input Section */}
                    <div className="np-voucher-section">
                      {/* Input row - trên cùng */}
                      <div className="np-voucher-input-row">
                        <input
                          type="text"
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleApplyVoucher();
                            }
                          }}
                          className="np-voucher-input"
                        />
                      </div>

                      {/* Buttons row - dưới input */}
                      <div className="np-voucher-buttons-row">
                        {myVouchers.length > 0 && (
                          <div ref={myVouchersRef} className="np-my-vouchers-wrapper">
                            <button
                              type="button"
                              onClick={() => setShowMyVouchers(!showMyVouchers)}
                              className="np-my-vouchers-btn"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                              </svg>
                              Voucher của tôi
                            </button>
                            {showMyVouchers && (
                              <div className="np-my-vouchers-dropdown">
                                <div className="np-my-vouchers-header">
                                  <strong>Voucher của tôi ({myVouchers.length})</strong>
                                </div>
                                <div className="np-my-vouchers-list">
                                  {myVouchers.map((voucher) => (
                                    <div
                                      key={voucher.id}
                                      className="np-my-voucher-item"
                                      onClick={() => handleSelectVoucher(voucher)}
                                    >
                                      <div className="np-my-voucher-code">{voucher.code}</div>
                                      <div className="np-my-voucher-info">
                                        <div className="np-my-voucher-desc">{voucher.description}</div>
                                        <div className="np-my-voucher-discount">
                                          Giảm: <strong>{formatDiscount(voucher)}</strong>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {myVouchers.length === 0 && (
                                  <div className="np-my-vouchers-empty">
                                    <p>Bạn chưa có voucher nào.</p>
                                    <a href="/ma-giam-gia">Xem mã giảm giá</a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={handleApplyVoucher}
                          disabled={!couponCode.trim()}
                          className="np-apply-voucher-btn"
                        >
                          Áp dụng
                        </button>
                      </div>

                      {/* Messages */}
                      {couponMessage && (
                        <div style={{
                          fontSize: '13px',
                          color: couponMessage.type === 'success' ? 'green' : 'red',
                          marginBottom: '8px'
                        }}>
                          {couponMessage.text}
                        </div>
                      )}

                      {/* Applied Voucher Tag */}
                      {appliedVoucher && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#f0f9ff',
                          border: '1px dashed #0046ad',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          color: '#0046ad',
                          marginTop: '8px'
                        }}>
                          <span>
                            <strong>{appliedVoucher.code}</strong>: -{formatPrice(effectiveDiscount)}
                          </span>
                          <button
                            onClick={handleRemoveVoucher}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#999',
                              cursor: 'pointer',
                              fontSize: '18px',
                              padding: '0 4px',
                              lineHeight: 1
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="np-summary-divider"></div>

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

                    {appliedVoucher && (
                      <div className="np-summary-row" style={{ color: '#28a745', fontWeight: 500 }}>
                        <span>Giảm giá ({appliedVoucher.code}):</span>
                        <span>-{formatPrice(effectiveDiscount)}</span>
                      </div>
                    )}

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
                          navigate('/thanh-toan', {
                            state: {
                              selectedItems: selectedCartItems,
                              subtotal,
                              shipping,
                              discount: effectiveDiscount,
                              voucher: appliedVoucher,
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
