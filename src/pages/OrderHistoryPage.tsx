import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

function OrderHistoryPage(): React.JSX.Element {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load orders from localStorage
    const loadOrders = () => {
      try {
        const storedOrders = localStorage.getItem('order_history');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Chờ xử lý', color: '#f59e0b' },
      processing: { label: 'Đang xử lý', color: '#3b82f6' },
      shipped: { label: 'Đang giao hàng', color: '#8b5cf6' },
      delivered: { label: 'Đã giao hàng', color: '#10b981' },
      cancelled: { label: 'Đã hủy', color: '#ef4444' }
    };
    return statusMap[status] || { label: status, color: '#6b7280' };
  };

  if (loading) {
    return (
      <div className="np-app">
        <Header />
        <main className="np-main" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div>Đang tải lịch sử mua hàng...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="np-app">
      <Header />
      <Breadcrumb
        items={[
          { label: 'Trang chủ', link: '/' },
          { label: 'Lịch sử mua hàng' }
        ]}
      />

      <main className="np-main">
        <div className="np-container" style={{ padding: '40px 16px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#333' }}>
            Lịch sử mua hàng
          </h1>
          <p style={{ color: '#666', marginBottom: '32px' }}>
            Xem lại các đơn hàng bạn đã đặt
          </p>

          {orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #e2e4ea'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{ margin: '0 auto 16px' }}>
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#333' }}>
                Chưa có đơn hàng nào
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              <a
                href="/san-pham"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: '#0046ad',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#003d94';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0046ad';
                }}
              >
                Xem sản phẩm
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => {
                const statusInfo = getStatusLabel(order.status);
                return (
                  <div
                    key={order.id}
                    style={{
                      background: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e2e4ea',
                      padding: '24px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #e2e4ea'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: 0 }}>
                            Đơn hàng #{order.orderNumber}
                          </h3>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: `${statusInfo.color}20`,
                            color: statusInfo.color
                          }}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: 0 }}>
                          {formatPrice(order.total)}
                        </p>
                        <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #e2e4ea'
                            }}
                            onError={(e) => {
                              e.currentTarget.src = '/logo192.png';
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '500', color: '#333', margin: '0 0 4px 0' }}>
                              {item.name}
                            </p>
                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                              Số lượng: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <p style={{ fontWeight: '600', color: '#333', margin: 0 }}>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e2e4ea',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '12px'
                    }}>
                      <button
                        style={{
                          padding: '8px 16px',
                          border: '1px solid #e2e4ea',
                          background: '#fff',
                          color: '#333',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#0046ad';
                          e.currentTarget.style.color = '#0046ad';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e2e4ea';
                          e.currentTarget.style.color = '#333';
                        }}
                      >
                        Xem chi tiết
                      </button>
                      {order.status === 'delivered' && (
                        <button
                          style={{
                            padding: '8px 16px',
                            border: '1px solid #0046ad',
                            background: '#0046ad',
                            color: '#fff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#003d94';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#0046ad';
                          }}
                        >
                          Mua lại
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderHistoryPage;

