import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { PRODUCTS, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCompare } from '../contexts/CompareContext';
import Toast from '../components/common/Toast';
import '../components/layout/FilterBar.css';
import ColorSelectionModal from '../components/common/ColorSelectionModal';
import { PaintColor } from '../data/paintColors';

interface ProductsPageProps {
  category?: string;
}

const ProductCard = ({ product, wishlistIds, toggleWishlist, onAddToCart, onRequestAddToCart }: {
  product: Product,
  wishlistIds: number[],
  toggleWishlist: (id: number) => void,
  onAddToCart: (message: string, type?: 'success' | 'error') => void,
  onRequestAddToCart: (product: Product, quantity: number) => void
}) => {
  const [quantity, setQuantity] = useState(1);
  // const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isCompared = isInCompare(product.id);

  const handleCompareClick = () => {
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="np-product-card" style={{
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
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: isCompared ? '#e60012' : '#e5e7eb',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          color: isCompared ? '#fff' : '#4b5563',
          textTransform: 'uppercase',
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'all 0.2s'
        }} onClick={handleCompareClick}>
          <span style={{
            width: '14px',
            height: '14px',
            border: '1px solid currentColor',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px'
          }}>
            {isCompared && '✓'}
          </span>
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
        {product.isBestSeller && <span className="np-badge-bestseller">Bán chạy</span>}
      </div>
      <div className="np-card-content">
        <span className="np-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        {product.features && (
          <ul className="np-features-list">
            {product.features.slice(0, 2).map((feature, idx) => (
              <li key={idx}>• {feature}</li>
            ))}
          </ul>
        )}

        {/* Price and Cart UI */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', marginTop: 'auto' }}>
          <div className="np-product-price" style={{ color: '#e60012', fontWeight: 'bold', margin: '0' }}>
            {product.price?.toLocaleString('vi-VN')} ₫
          </div>

          <div className="quantity" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ border: 'none', background: 'transparent', padding: '4px 8px', cursor: 'pointer', color: '#666' }}
              >-</button>
              <span style={{ fontSize: '13px', minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ border: 'none', background: 'transparent', padding: '4px 8px', cursor: 'pointer', color: '#666' }}
              >+</button>
            </div>
            <button className="add-cart"
              onClick={() => {
                onRequestAddToCart(product, quantity);
              }}
              style={{
                background: '#e60012',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(230, 0, 18, 0.2)',
                transition: 'all 0.2s ease'
              }}
              title={`Thêm ${quantity} sản phẩm vào giỏ`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
            </button>
          </div>
        </div>

        <Link to={`/san-pham/${product.slug}`} className="np-btn-outline" style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}>Xem chi tiết</Link>
      </div>
    </div>
  );
};

function ProductsPage({ category }: ProductsPageProps): React.JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // State for filtering and display
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [pageTitle, setPageTitle] = useState('Sản phẩm Nippon Paint');

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [featureFilter, setFeatureFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('default');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; // 12 products per page

  // State for wishlist
  const [wishlistIds, setWishlistIds] = React.useState<number[]>([]);

  // State for toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Color Selection Modal State
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{ product: Product, quantity: number } | null>(null);
  const { addToCart } = useCart();

  const handleRequestAddToCart = (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', 'error');
      navigate('/login');
      return;
    }
    setPendingProduct({ product, quantity });
    setIsColorModalOpen(true);
  };

  const handleColorSelect = async (color: PaintColor) => {
    if (pendingProduct) {
      try {
        if (!isAuthenticated) {
          showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', 'error');
          navigate('/login');
          return;
        }
        // Construct the color string, e.g., "Reticent White (NP OW 1083P)"
        const colorString = `${color.name} (${color.code})`;
        await addToCart(pendingProduct.product.id, pendingProduct.quantity, colorString);
        showToast(`Đã thêm ${pendingProduct.quantity} ${pendingProduct.product.name} (Màu: ${color.name}) vào giỏ hàng!`, 'success');
      } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        if ((error as any)?.message === 'AUTH_REQUIRED') {
          showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', 'error');
          navigate('/login');
          return;
        }
        showToast('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng', 'error');
      } finally {
        setIsColorModalOpen(false);
        setPendingProduct(null);
      }
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      setWishlistIds([]);
      return;
    }
    const key = `wishlist_${user.id}`;
    const stored = localStorage.getItem(key);
    setWishlistIds(stored ? JSON.parse(stored) : []);
  }, [isAuthenticated, user?.id]);

  const toggleWishlist = (id: number) => {
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để sử dụng tính năng yêu thích', 'error');
      navigate('/login');
      return;
    }

    const newWishlist = wishlistIds.includes(id)
      ? wishlistIds.filter(wId => wId !== id)
      : [...wishlistIds, id];
    setWishlistIds(newWishlist);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Initial setup from URL prop
  useEffect(() => {
    if (category) {
      if (category === 'son-noi-that') setCategoryFilter('Sơn Nội Thất');
      else if (category === 'son-ngoai-that') setCategoryFilter('Sơn Ngoại Thất');
      else if (category === 'son-dan-dung') setCategoryFilter('Sơn dân dụng');
      else if (category === 'son-va-chat-phu-cong-nghiep') setCategoryFilter('Sơn và chất phủ công nghiệp');
    }
  }, [category]);

  useEffect(() => {
    let filtered = PRODUCTS;
    let title = 'Sản phẩm Nippon Paint';

    // 1. Filter by Category (Dòng sản phẩm)
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
      title = categoryFilter.toUpperCase();
    }

    // 2. Filter by Product Type (Loại sơn: Lót, Phủ, Bột trét, Chống thấm)
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        const cat = p.category.toLowerCase();

        if (typeFilter === 'primer') {
          // Sơn lót
          return name.includes('lót') || name.includes('primer') || name.includes('sealer');
        } else if (typeFilter === 'putty') {
          // Bột trét
          return name.includes('bột trét') || name.includes('putty') || name.includes('skimcoat') || name.includes('mastic');
        } else if (typeFilter === 'waterproof') {
          // Chống thấm
          return name.includes('chống thấm') || name.includes('wp');
        } else if (typeFilter === 'topcoat') {
          // Sơn phủ (Là các loại còn lại, trừ 3 loại trên)
          const isPrimer = name.includes('lót') || name.includes('primer') || name.includes('sealer');
          const isPutty = name.includes('bột trét') || name.includes('putty') || name.includes('skimcoat');
          const isWP = name.includes('chống thấm') || name.includes('wp');
          return !isPrimer && !isPutty && !isWP;
        }
        return true;
      });
    }

    // 3. Filter by Features (Tính năng)
    if (featureFilter !== 'all') {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        const desc = p.description?.toLowerCase() || '';
        const features = p.features?.map(f => f.toLowerCase()).join(' ') || '';
        const combinedText = `${name} ${desc} ${features}`;

        if (featureFilter === 'easy-wash') {
          return combinedText.includes('lau chùi') || combinedText.includes('clean') || combinedText.includes('easy wash');
        } else if (featureFilter === 'antibacterial') {
          return combinedText.includes('kháng khuẩn') || combinedText.includes('virus') || combinedText.includes('odour-less') || combinedText.includes('mùi nhẹ');
        } else if (featureFilter === 'gloss') {
          return combinedText.includes('bóng');
        } else if (featureFilter === 'matt') {
          return combinedText.includes('mờ') || combinedText.includes('mịn');
        } else if (featureFilter === 'durable') {
          return combinedText.includes('bền màu') || combinedText.includes('bảo vệ');
        }
        return true;
      });
    }

    // 4. Sort by Price
    if (sortOrder === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setDisplayedProducts(filtered);
    // Update title only if category changed via prop, otherwise keep it generic if manually filtering
    if (!category) setPageTitle('TẤT CẢ SẢN PHẨM');
    else setPageTitle(title);

    setCurrentPage(1);
  }, [categoryFilter, typeFilter, featureFilter, sortOrder, category]);

  // Calculate pagination
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = displayedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <Breadcrumb items={[
          { label: 'Trang chủ', link: '/' },
          { label: 'Sản phẩm', link: '/san-pham' },
          ...(categoryFilter !== 'all' ? [{ label: categoryFilter }] : [])
        ]} />

        <section className="np-page-title">
          <div className="np-container">
            <h1>{pageTitle}</h1>
            <p className="np-page-subtitle">
              Giải pháp sơn toàn diện cho ngôi nhà của bạn
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="np-filter-bar-wrapper">
          <div className="np-container">
            <div className="np-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end', justifyContent: 'center' }}>

              {/* Filter 1: Product Category */}
              <div className="np-filter-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Dòng sản phẩm:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ minWidth: '150px', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
                >
                  <option value="all">Tất cả</option>
                  <option value="Sơn Nội Thất">Sơn Nội Thất</option>
                  <option value="Sơn Ngoại Thất">Sơn Ngoại Thất</option>
                  <option value="Sơn dân dụng">Sơn Dầu / Gỗ & Kim Loại</option>
                  <option value="Sơn và chất phủ công nghiệp">Sơn Công Nghiệp</option>
                </select>
              </div>

              {/* Filter 2: Function/Type */}
              <div className="np-filter-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Loại sơn:</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{ minWidth: '130px', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
                >
                  <option value="all">Tất cả</option>
                  <option value="topcoat">Sơn phủ (Hoàn thiện)</option>
                  <option value="primer">Sơn lót (Primer/Sealer)</option>
                  <option value="putty">Bột trét (Putty/Mastic)</option>
                  <option value="waterproof">Chống thấm</option>
                </select>
              </div>

              {/* Filter 3: Features */}
              <div className="np-filter-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Tính năng:</label>
                <select
                  value={featureFilter}
                  onChange={(e) => setFeatureFilter(e.target.value)}
                  style={{ minWidth: '130px', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
                >
                  <option value="all">Tất cả</option>
                  <option value="easy-wash">Dễ lau chùi / Sạch</option>
                  <option value="antibacterial">Kháng khuẩn / Mùi nhẹ</option>
                  <option value="gloss">Bóng / Siêu bóng</option>
                  <option value="matt">Mờ / Mịn</option>
                  <option value="durable">Bền màu / Bảo vệ tốt</option>
                </select>
              </div>

              {/* Filter 4: Sort Price */}
              <div className="np-filter-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>Sắp xếp:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{ minWidth: '130px', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>

              <button
                className="np-btn-apply"
                onClick={() => {
                  setCategoryFilter('all');
                  setTypeFilter('all');
                  setFeatureFilter('all');
                  setSortOrder('default');
                }}
                style={{
                  height: '38px',
                  padding: '0 15px',
                  backgroundColor: '#fff',
                  border: '1px solid #e60012',
                  color: '#e60012',
                  borderRadius: '4px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '13px',
                  marginBottom: '1px' // Align visually
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e60012'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#e60012'; }}
              >
                XÓA BỘ LỌC
              </button>
            </div>
          </div>
        </div>

        <section className="np-products-section">
          <div className="np-container">
            {/* Products count info */}
            {displayedProducts.length > 0 && (
              <div style={{
                marginBottom: '20px',
                color: '#666',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, displayedProducts.length)} trong tổng số {displayedProducts.length} sản phẩm
                </span>
              </div>
            )}

            <div className="np-products-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlistIds={wishlistIds}
                    toggleWishlist={toggleWishlist}
                    onAddToCart={showToast}
                    onRequestAddToCart={handleRequestAddToCart}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', gridColumn: 'span 3' }}>
                  <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                marginTop: '40px',
                padding: '20px 0'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  title="Trang trước"
                  style={{
                    minWidth: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb',
                    background: currentPage === 1 ? '#f9fafb' : '#fff',
                    color: currentPage === 1 ? '#d1d5db' : '#374151',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#e60012', e.currentTarget.style.color = '#e60012')}
                  onMouseLeave={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#e5e7eb', e.currentTarget.style.color = '#374151')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  <span style={{ marginLeft: '4px', fontSize: '13px', fontWeight: 500 }}>Trước</span>
                </button>

                {(() => {
                  const siblingCount = 1;
                  const range = [];
                  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
                  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
                  const shouldShowLeftDots = leftSiblingIndex > 2;
                  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) range.push(i);
                  } else {
                    if (!shouldShowLeftDots && shouldShowRightDots) {
                      for (let i = 1; i <= 5; i++) range.push(i);
                      range.push('...');
                      range.push(totalPages);
                    } else if (shouldShowLeftDots && !shouldShowRightDots) {
                      range.push(1);
                      range.push('...');
                      for (let i = totalPages - 4; i <= totalPages; i++) range.push(i);
                    } else if (shouldShowLeftDots && shouldShowRightDots) {
                      range.push(1);
                      range.push('...');
                      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) range.push(i);
                      range.push('...');
                      range.push(totalPages);
                    }
                  }

                  return range.map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`dots-${index}`} style={{ padding: '0 6px', color: '#9ca3af', fontWeight: 500 }}>...</span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        style={{
                          minWidth: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: currentPage === page ? '1px solid #e60012' : '1px solid #e5e7eb',
                          background: currentPage === page ? '#e60012' : '#fff',
                          color: currentPage === page ? '#fff' : '#374151',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: currentPage === page ? '700' : '500',
                          fontSize: '14px',
                          transition: 'all 0.2s',
                          boxShadow: currentPage === page ? '0 2px 4px rgba(230,0,18,0.2)' : 'none'
                        }}
                        onMouseEnter={(e) => currentPage !== page && (e.currentTarget.style.borderColor = '#e60012', e.currentTarget.style.color = '#e60012', e.currentTarget.style.background = '#fff')}
                        onMouseLeave={(e) => currentPage !== page && (e.currentTarget.style.borderColor = '#e5e7eb', e.currentTarget.style.color = '#374151', e.currentTarget.style.background = '#fff')}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title="Trang sau"
                  style={{
                    minWidth: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb',
                    background: currentPage === totalPages ? '#f9fafb' : '#fff',
                    color: currentPage === totalPages ? '#d1d5db' : '#374151',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#e60012', e.currentTarget.style.color = '#e60012')}
                  onMouseLeave={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#e5e7eb', e.currentTarget.style.color = '#374151')}
                >
                  <span style={{ marginRight: '4px', fontSize: '13px', fontWeight: 500 }}>Sau</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </main>

      <ColorSelectionModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSelect={handleColorSelect}
        productName={pendingProduct?.product.name || ''}
      />

      <Footer />
    </div>
  );
}

export default ProductsPage;

