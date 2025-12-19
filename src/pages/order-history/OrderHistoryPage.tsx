import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useCart } from '../../contexts/CartContext';
import './OrderHistoryPage.css';

interface Order {
  id: string;
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    note?: string;
  };
  paymentMethod: {
    type: 'cod' | 'qr';
    name: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: string;
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

function OrderHistoryPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { getOrderHistory } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã giao hàng';
      case 'delivered': return 'Đã nhận hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const orderHistory = getOrderHistory();

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const closeOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Lịch sử mua hàng' }
          ]}
        />

        <section className="np-page-title">
          <div className="np-container">
            <h1>Lịch sử mua hàng</h1>
            <p>Theo dõi các đơn hàng của bạn</p>
          </div>
        </section>

        <section className="np-order-history-section">
          <div className="np-container">
            {orderHistory.length === 0 ? (
              <div className="np-no-orders">
                <div className="np-no-orders-icon">📦</div>
                <h3>Bạn chưa có đơn hàng nào</h3>
                <p>Hãy khám phá sản phẩm và đặt hàng để theo dõi tại đây!</p>
                <button
                  className="np-btn-primary"
                  onClick={() => navigate('/san-pham')}
                >
                  Mua sắm ngay
                </button>
              </div>
            ) : (
              <div className="np-orders-list">
                {orderHistory.map((order: Order) => (
                  <div key={order.id} className="np-order-card">
                    {/* Order Header */}
                    <div className="np-order-header">
                      <div className="np-order-info">
                        <h4>{order.orderId}</h4>
                        <p className="np-order-date">{formatDate(order.orderDate)}</p>
                      </div>
                      <div
                        className="np-order-status"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="np-order-summary">
                      <div className="np-order-items-count">
                        {order.items.length} sản phẩm
                      </div>
                      <div className="np-order-total">
                        <strong>{formatPrice(order.total)}</strong>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="np-order-items-preview">
                      <div className="np-order-items-header">
                        <h5>Sản phẩm đã mua:</h5>
                        {order.items.length >= 3 && (
                          <button 
                            className="np-expand-btn"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {expandedOrders.has(order.id) ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                          </button>
                        )}
                      </div>
                      
                      <div className="np-order-items-list">
                        {order.items.slice(0, expandedOrders.has(order.id) ? order.items.length : 2).map(item => (
                          <div key={item.id} className="np-order-item-preview">
                            <div className="np-order-item-image">
                              <img src={item.image} alt={item.name} />
                            </div>
                            <div className="np-order-item-details">
                              <h6>{item.name}</h6>
                              {item.color && <p className="np-order-item-color">Màu: {item.color}</p>}
                              <p className="np-order-item-quantity">SL: {item.quantity} × {formatPrice(item.price)}</p>
                              <p className="np-order-item-subtotal"><strong>{formatPrice(item.price * item.quantity)}</strong></p>
                            </div>
                          </div>
                        ))}
                        
                        {!expandedOrders.has(order.id) && order.items.length > 2 && (
                          <div className="np-order-items-more">
                            Và {order.items.length - 2} sản phẩm khác...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="np-order-actions">
                      <button 
                        className="np-btn-outline-small"
                        onClick={() => handleOrderClick(order)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="np-order-detail-modal-overlay" onClick={closeOrderDetail}>
          <div className="np-order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="np-order-detail-modal-header">
              <h3>Chi tiết đơn hàng {selectedOrder.orderId}</h3>
              <button 
                className="np-modal-close" 
                onClick={closeOrderDetail}
              >
                ×
              </button>
            </div>
            
            <div className="np-order-detail-modal-content">
              {/* Order Info */}
              <div className="np-order-detail-info">
                <div className="np-order-detail-row">
                  <span><strong>Mã đơn hàng:</strong></span>
                  <span>{selectedOrder.orderId}</span>
                </div>
                <div className="np-order-detail-row">
                  <span><strong>Ngày đặt:</strong></span>
                  <span>{formatDate(selectedOrder.orderDate)}</span>
                </div>
                <div className="np-order-detail-row">
                  <span><strong>Trạng thái:</strong></span>
                  <span 
                    className="np-order-status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="np-order-detail-row">
                  <span><strong>Phương thức thanh toán:</strong></span>
                  <span>{selectedOrder.paymentMethod.name}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="np-order-detail-section">
                <h4>Thông tin khách hàng</h4>
                <div className="np-order-detail-customer">
                  <p><strong>{selectedOrder.customerInfo.fullName}</strong></p>
                  <p>{selectedOrder.customerInfo.phone}</p>
                  <p>{selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.ward}, {selectedOrder.customerInfo.district}, {selectedOrder.customerInfo.city}</p>
                  {selectedOrder.customerInfo.note && (
                    <p><strong>Ghi chú:</strong> {selectedOrder.customerInfo.note}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="np-order-detail-section">
                <h4>Sản phẩm đã đặt</h4>
                <div className="np-order-detail-items">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="np-order-detail-item">
                      <div className="np-order-detail-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="np-order-detail-item-info">
                        <h5>{item.name}</h5>
                        {item.color && <p className="np-order-item-color">Màu: {item.color}</p>}
                        <p>Số lượng: {item.quantity} × {formatPrice(item.price)}</p>
                        <p className="np-order-item-total"><strong>{formatPrice(item.price * item.quantity)}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="np-order-detail-totals">
                <div className="np-order-detail-total-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="np-order-detail-total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{selectedOrder.shipping === 0 ? 'Miễn phí' : formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="np-order-detail-total-divider"></div>
                <div className="np-order-detail-total-row total">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="np-order-detail-actions">
                <button 
                  className="np-btn-outline"
                  onClick={closeOrderDetail}
                >
                  Đóng
                </button>
                <button 
                  className="np-btn-primary"
                  onClick={() => {
                    // Có thể thêm logic để mua lại hoặc liên hệ hỗ trợ
                    console.log('Liên hệ hỗ trợ cho đơn hàng:', selectedOrder.orderId);
                  }}
                >
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
