import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useCart } from '../../contexts/CartContext';
import './CheckoutPage.css';

interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  image: string;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  ward: string; 
  district: string;
  city: string;
  note?: string;
}

interface PaymentMethod {
  type: 'cod' | 'qr';
  name: string;
}

function CheckoutPage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrderToHistory, removeItems } = useCart();
  
  // Lấy dữ liệu từ navigation state (từ cart page)
  const selectedItems = location.state?.selectedItems as CheckoutItem[] || [];
  const subtotal = location.state?.subtotal || 0;
  const shipping = location.state?.shipping || 0;
  const total = location.state?.total || 0;

  // Form states
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: '',
    ward: '', 
    district: '',
    city: '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'cod',
    name: 'Thanh toán khi nhận hàng'
  });

  const [showQR, setShowQR] = useState(false);
  const [qrConfirmed, setQrConfirmed] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!customerInfo.ward.trim()) {
      newErrors.ward = 'Vui lòng nhập phường/xã';
    }

    if (!customerInfo.district.trim()) {
      newErrors.district = 'Vui lòng nhập quận/huyện';
    }

    if (!customerInfo.city.trim()) {
      newErrors.city = 'Vui lòng nhập tỉnh/thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePaymentMethodChange = (type: PaymentMethod['type'], name: string) => {
    setPaymentMethod({ type, name });
    setShowQR(false);
    setQrConfirmed(false);
  };

  const handleShowQR = () => {
    setShowQRModal(true);
    setShowQR(true);
    // Auto confirm after 2 seconds
    setTimeout(() => {
      setQrConfirmed(true);
      setTimeout(() => {
        setShowQRModal(false);
      }, 1500); // Hide modal after showing success
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (selectedItems.length === 0) {
      alert('Không có sản phẩm nào được chọn để thanh toán');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order data: chuyển selectedItems sang đúng kiểu CartItem (cần có productId)
      const orderData = {
        id: `order-${Date.now()}`,
        customerInfo,
        paymentMethod,
        items: selectedItems.map(item => ({
          ...item,
          productId: item.id,  // Đảm bảo có field productId cho mỗi item
        })),
        subtotal,
        shipping,
        total,
        orderDate: new Date().toISOString(),
        orderId: 'NP' + Date.now(),
        status: 'pending' as const
      };

      await addOrderToHistory(orderData); // Lưu đơn hàng vào lịch sử
      await removeItems(selectedItems.map(item => item.id)); // Xóa sản phẩm khỏi giỏ

      setOrderId(orderData.orderId); // Lưu Order ID để hiển thị trong modal
      
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if no items selected
  if (selectedItems.length === 0) {
    return (
      <div className="np-app">
        <Header />
        <main className="np-main">
          <div className="np-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2>Không có sản phẩm nào được chọn</h2>
            <p>Vui lòng quay lại giỏ hàng và chọn sản phẩm để thanh toán.</p>
            <button 
              className="np-btn-primary"
              onClick={() => navigate('/gio-hang')}
            >
              Quay lại giỏ hàng
            </button>
          </div>
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
            { label: 'Giỏ hàng', link: '/gio-hang' },
            { label: 'Thanh toán' }
          ]}
        />

        <section className="np-page-title">
          <div className="np-container">
            <h1>Thanh toán</h1>
            <p>Hoàn tất đơn hàng của bạn</p>
          </div>
        </section>

        <section className="np-checkout-section">
          <div className="np-container">
            <form onSubmit={handleSubmit} className="np-checkout-form">
              <div className="np-checkout-content">
                {/* Thông tin khách hàng */}
                <div className="np-checkout-customer">
                  <h3>Thông tin khách hàng</h3>
                  
                  <div className="np-form-group">
                    <label htmlFor="fullName">Họ tên *</label>
                    <input
                      type="text"
                      id="fullName"
                      value={customerInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={errors.fullName ? 'error' : ''}
                      placeholder="Nhập họ tên đầy đủ"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="np-form-row">
                    <div className="np-form-group">
                      <label htmlFor="phone">Số điện thoại *</label>
                      <input
                        type="tel"
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={errors.phone ? 'error' : ''}
                        placeholder="0123 456 789"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="np-form-group">
                    <label htmlFor="address">Địa chỉ *</label>
                    <input
                      type="text"
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'error' : ''}
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="np-form-row">
                    <div className="np-form-group">
                      <label htmlFor="ward">Phường/Xã *</label>
                      <input
                        type="text"
                        id="ward"
                        value={customerInfo.ward}
                        onChange={(e) => handleInputChange('ward', e.target.value)}
                        className={errors.ward ? 'error' : ''}
                        placeholder="Phường/Xã"
                      />
                      {errors.ward && <span className="error-message">{errors.ward}</span>}
                    </div>

                    <div className="np-form-group">
                      <label htmlFor="district">Quận/Huyện *</label>
                      <input
                        type="text"
                        id="district"
                        value={customerInfo.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className={errors.district ? 'error' : ''}
                        placeholder="Quận/Huyện"
                      />
                      {errors.district && <span className="error-message">{errors.district}</span>}
                    </div>
                  </div>

                  <div className="np-form-group">
                    <label htmlFor="city">Tỉnh/Thành phố *</label>
                    <input
                      type="text"
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={errors.city ? 'error' : ''}
                      placeholder="Tỉnh/Thành phố"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="np-form-group">
                    <label htmlFor="note">Ghi chú (tùy chọn)</label>
                    <textarea
                      id="note"
                      value={customerInfo.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      placeholder="Ghi chú về đơn hàng..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Tóm tắt đơn hàng + Phương thức thanh toán */}
                <div className="np-checkout-right">
                  {/* Tóm tắt đơn hàng */}
                  <div className="np-checkout-summary">
                    <h3>Đơn hàng của bạn</h3>
                    
                    <div className="np-checkout-items">
                      {selectedItems.map(item => (
                        <div key={item.id} className="np-checkout-item">
                          <div className="np-checkout-item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="np-checkout-item-info">
                            <h4>{item.name}</h4>
                            {item.color && <p className="np-checkout-item-color">Màu: {item.color}</p>}
                            <p className="np-checkout-item-quantity">Số lượng: {item.quantity}</p>
                            <p className="np-checkout-item-price">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="np-checkout-totals">
                      <div className="np-checkout-total-row">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      
                      <div className="np-checkout-total-row">
                        <span>Phí vận chuyển:</span>
                        <span>
                          {shipping === 0 
                            ? 'Miễn phí' 
                            : formatPrice(shipping)
                          }
                        </span>
                      </div>
                      
                      <div className="np-checkout-total-divider"></div>
                      
                      <div className="np-checkout-total-row total">
                        <span>Tổng cộng:</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div className="np-checkout-payment">
                    <h3>Phương thức thanh toán</h3>
                    
                    <div className="np-payment-methods">
                      <div 
                        className={`np-payment-method ${paymentMethod.type === 'cod' ? 'active' : ''}`}
                        onClick={() => handlePaymentMethodChange('cod', 'Thanh toán khi nhận hàng')}
                      >
                        <input
                          type="radio"
                          id="cod"
                          name="payment"
                          checked={paymentMethod.type === 'cod'}
                          onChange={() => handlePaymentMethodChange('cod', 'Thanh toán khi nhận hàng')}
                        />
                        <label htmlFor="cod">
                          <div className="np-payment-info">
                            <strong>Thanh toán khi nhận hàng</strong>
                            <p>Thanh toán bằng tiền mặt khi nhận hàng tại nhà</p>
                          </div>
                        </label>
                      </div>

                      <div 
                        className={`np-payment-method ${paymentMethod.type === 'qr' ? 'active' : ''}`}
                        onClick={() => handlePaymentMethodChange('qr', 'Chuyển khoản QR')}
                      >
                        <input
                          type="radio"
                          id="qr"
                          name="payment"
                          checked={paymentMethod.type === 'qr'}
                          onChange={() => handlePaymentMethodChange('qr', 'Chuyển khoản QR')}
                        />
                        <label htmlFor="qr">
                          <div className="np-payment-info">
                            <strong>Chuyển khoản ngân hàng (QR Code)</strong>
                            <p>Quét mã QR để chuyển khoản nhanh chóng</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    {paymentMethod.type === 'qr' && (
                      <div className="np-qr-section">
                        {!qrConfirmed ? (
                          <div className="np-qr-intro">
                            <p>Nhấn nút bên dưới để quét mã QR thanh toán</p>
                            <button 
                              type="button"
                              className="np-btn-secondary"
                              onClick={handleShowQR}
                            >
                              Mở QR Code
                            </button>
                          </div>
                        ) : (
                          <div className="np-qr-confirmed">
                            <div className="np-success-icon"></div>
                            <p><strong>Đã thanh toán thành công!</strong></p>
                            <p>Số tiền {formatPrice(total)} đã được chuyển khoản.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Button đặt hàng */}
                    <button 
                      type="submit" 
                      className="np-btn-primary np-btn-full np-checkout-submit-btn"
                      disabled={isSubmitting || (paymentMethod.type === 'qr' && !qrConfirmed)}
                    >
                      {isSubmitting ? 'Đang xử lý...' : 
                       paymentMethod.type === 'qr' && !qrConfirmed ? 'Vui lòng thanh toán trước' :
                       'Đặt hàng'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />

      {/* QR Modal */}
      {showQRModal && (
        <div className="np-qr-modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="np-qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="np-qr-modal-header">
              <h3>Quét mã QR để thanh toán</h3>
              <button 
                className="np-modal-close" 
                onClick={() => setShowQRModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="np-qr-modal-content">
              {!qrConfirmed ? (
                <>
                  <div className="np-qr-code">
                    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <rect width="200" height="200" fill="#ffffff" stroke="#000000" strokeWidth="2"/>
                      <rect x="20" y="20" width="40" height="40" fill="#000000"/>
                      <rect x="140" y="20" width="40" height="40" fill="#000000"/>
                      <rect x="20" y="140" width="40" height="40" fill="#000000"/>
                      <rect x="80" y="80" width="40" height="40" fill="#000000"/>
                      <rect x="60" y="60" width="80" height="80" fill="#ffffff" stroke="#000000"/>
                      <text x="100" y="95" textAnchor="middle" fontSize="12" fill="#000000">QR PAY</text>
                      <text x="100" y="110" textAnchor="middle" fontSize="10" fill="#000000">NIPPON PAINT</text>
                      <text x="100" y="125" textAnchor="middle" fontSize="8" fill="#666">{formatPrice(total)}</text>
                    </svg>
                  </div>
                  <div className="np-qr-info">
                    <p><strong>Số tiền:</strong> {formatPrice(total)}</p>
                    <p><strong>Ngân hàng:</strong> Vietcombank</p>
                    <p><strong>STK:</strong> 1234567890</p>
                    <p><strong>Người nhận:</strong> NIPPON PAINT VIETNAM</p>
                  </div>
                  <div className="np-qr-waiting">
                    <div className="np-loading-spinner"></div>
                    <p>Đang xử lý thanh toán...</p>
                  </div>
                </>
              ) : (
                <div className="np-qr-success">
                  <div className="np-success-icon-large"></div>
                  <h4>Thanh toán thành công!</h4>
                  <p>Số tiền {formatPrice(total)} đã được chuyển khoản.</p>
                
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderId && (
        <div className="np-order-success-modal-overlay" onClick={() => navigate('/')}>
          <div className="np-order-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="np-order-success-modal-header">
              <h3>Đặt hàng thành công!</h3>
              <button
                className="np-modal-close"
                onClick={() => navigate('/')}
              >
                ×
              </button>
            </div>
            <div className="np-order-success-modal-content">
              <div className="np-success-icon-large">✓</div>
              <h4>Cảm ơn bạn đã đặt hàng!</h4>
              <p>Mã đơn hàng của bạn là: <strong>{orderId}</strong></p>
              <p>Đơn hàng sẽ được giao đến bạn trong thời gian sớm nhất.</p>

              <div className="np-order-details-summary">
                <h5>Chi tiết đơn hàng</h5>
                <div className="np-order-summary-items">
                  {selectedItems.map(item => (
                    <div key={item.id} className="np-order-summary-item">
                      <div className="np-order-summary-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="np-order-summary-item-info">
                        <strong>{item.name}</strong>
                        <p>{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="np-order-summary-totals">
                  <div className="np-summary-row">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="np-summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  <div className="np-summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                className="np-btn-primary np-btn-full"
                onClick={() => navigate('/lich-su-mua-hang')}
              >
                Xem lịch sử mua hàng
              </button>
              <button
                className="np-btn-outline np-btn-full"
                onClick={() => navigate('/')}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
