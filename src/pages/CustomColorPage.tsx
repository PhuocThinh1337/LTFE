import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import ColorMixingPanel from '../components/color/ColorMixingPanel';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { PRODUCTS } from '../data/products';
import type { CustomMix } from '../services/colorMixingService';
import './CustomColorPage.css';

function CustomColorPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [currentMix, setCurrentMix] = useState<CustomMix | null>(null);
  const [resultColor, setResultColor] = useState('#0046ad');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    return () => {
      setCurrentMix(null);
      setSelectedProduct(null);
      setResultColor('#0046ad');
      setTotalPrice(0);
    };
  }, []);

  const customizableProducts = PRODUCTS.filter(
    p => p.category === 'Sơn Nội Thất' || p.category === 'Sơn Ngoại Thất'
  ).slice(0, 6);

  const getBasePrice = (): number => {
    if (!selectedProduct) return 0;
    const product = customizableProducts.find(p => p.id === selectedProduct);
    if (!product) return 0;
    return product.price / 5;
  };

  const handleMixChange = (mix: CustomMix, color: string, price: number) => {
    setCurrentMix(mix);
    setResultColor(color);
    setTotalPrice(price);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) {
      alert('Vui lòng chọn sản phẩm');
      return;
    }

    if (!currentMix) {
      alert('Vui lòng pha màu trước khi thêm vào giỏ hàng');
      return;
    }

    try {
      // Option B: bắt buộc đăng nhập mới được thêm vào giỏ
      if (!user) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        navigate('/login');
        return;
      }

      const product = customizableProducts.find(p => p.id === selectedProduct);
      if (!product) {
        alert('Không tìm thấy sản phẩm');
        return;
      }

      const mixName = currentMix.formula 
        ? `${product.name} - ${currentMix.formula.name}`
        : `${product.name} - Màu tự pha`;
      
      await addToCart(selectedProduct, 1, resultColor);
      
      const cartKey = `cart_${user.id}`;
      
      setTimeout(() => {
        const cartItems: any[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
        const lastItem = cartItems[cartItems.length - 1];
        
        if (lastItem && lastItem.productId === selectedProduct && lastItem.color === resultColor) {
          const mixInfo = {
            mix: currentMix,
            resultColor,
            totalPrice,
            volume: currentMix.volume,
            mixName,
          };
          
          lastItem.customMix = mixInfo;
          lastItem.price = totalPrice;
          lastItem.name = mixName;
          
          localStorage.setItem(cartKey, JSON.stringify(cartItems));
          
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }, 100);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="np-app">
      <Header />
      <main className="np-custom-color-page">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Phối màu tùy chỉnh' }
          ]}
        />

        <div className="np-container">
          <div className="np-custom-color-header">
            <h1>Pha màu sơn tùy chỉnh</h1>
            <p>Chọn công thức có sẵn hoặc tự pha màu theo sở thích của bạn</p>
          </div>

          {/* Color Mixing Panel */}
          <ColorMixingPanel
            selectedProduct={selectedProduct}
            basePrice={getBasePrice()}
            onMixChange={handleMixChange}
          />

          <div className="np-custom-color-content">
            {/* Left: Product Selection & Info */}
            <div className="np-custom-color-left">
              <div className="np-custom-color-section">
                <h2>Chọn sản phẩm sơn nền</h2>
                <p className="np-section-description">
                  Chọn loại sơn nền để pha màu. Giá sẽ được tính dựa trên công thức pha màu và dung tích.
                </p>
                <div className="np-product-selector">
                  {customizableProducts.map(product => (
                    <div
                      key={product.id}
                      className={`np-product-option ${selectedProduct === product.id ? 'selected' : ''}`}
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      <img src={product.image} alt={product.name} />
                      <div className="np-product-option-info">
                        <h3>{product.name}</h3>
                        <p className="np-product-option-price">
                          {formatPrice(product.price)} / 5L
                        </p>
                        <p className="np-product-option-category">{product.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {currentMix && (
                <div className="np-custom-color-section">
                  <h2>Thông tin đơn hàng</h2>
                  <div className="np-order-info">
                    <div className="np-order-color-result">
                      <span className="np-order-label">Màu đã pha:</span>
                      <div className="np-order-color-display">
                        <div 
                          className="np-order-color-preview-large" 
                          style={{ backgroundColor: resultColor }}
                        />
                        <div className="np-order-color-details">
                          <div className="np-order-color-hex">{resultColor}</div>
                          <div className="np-order-color-name">
                            {currentMix.formula ? currentMix.formula.name : 'Màu tự pha'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {currentMix.formula && (
                      <div className="np-order-info-row">
                        <span>Công thức:</span>
                        <strong>{currentMix.formula.name}</strong>
                      </div>
                    )}
                    {currentMix.customMix && (
                      <div className="np-order-info-row">
                        <span>Pha tùy chỉnh:</span>
                        <strong>{currentMix.customMix.length} màu</strong>
                      </div>
                    )}
                    <div className="np-order-info-row">
                      <span>Dung tích:</span>
                      <strong>{currentMix.volume} lít</strong>
                    </div>
                    <div className="np-order-info-row total">
                      <span>Tổng tiền:</span>
                      <strong className="np-total-price">{formatPrice(totalPrice)}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="np-custom-color-actions">
                <button
                  className="np-btn-add-cart-custom"
                  onClick={handleAddToCart}
                  disabled={!selectedProduct || !currentMix}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  className="np-btn-view-cart"
                  onClick={() => navigate('/gio-hang')}
                >
                  Xem giỏ hàng
                </button>
              </div>

              {showSuccess && (
                <div className="np-custom-success-message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Đã thêm vào giỏ hàng!
                </div>
              )}
            </div>

            {/* Right: Preview */}
            <div className="np-custom-color-right">
              <div className="np-custom-preview">
                <h2>Xem trước</h2>
                {selectedProduct && currentMix ? (
                  <div className="np-preview-product">
                    <div className="np-preview-image-wrapper">
                      <img 
                        src={customizableProducts.find(p => p.id === selectedProduct)?.image || ''} 
                        alt="Product"
                      />
                      <div 
                        className="np-preview-color-overlay"
                        style={{ backgroundColor: resultColor, opacity: 0.4 }}
                      />
                    </div>
                    <div className="np-preview-info">
                      <h3>{customizableProducts.find(p => p.id === selectedProduct)?.name}</h3>
                      {currentMix.formula && (
                        <div className="np-preview-formula">
                          <span className="np-preview-label">Công thức:</span>
                          <span>{currentMix.formula.name}</span>
                        </div>
                      )}
                      <div className="np-preview-color-badge" style={{ backgroundColor: resultColor }}>
                        <span>{resultColor}</span>
                      </div>
                      <div className="np-preview-volume">
                        <span className="np-preview-label">Dung tích:</span>
                        <span>{currentMix.volume} lít</span>
                      </div>
                      <div className="np-preview-price">
                        {formatPrice(totalPrice)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="np-preview-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <p>Chọn sản phẩm và pha màu để xem trước</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CustomColorPage;
