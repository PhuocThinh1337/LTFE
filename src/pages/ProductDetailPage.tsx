import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { PRODUCTS, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetailPage.css';

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

const ProductDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<'info' | 'system' | 'data' | 'reviews'>('info');
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [suggestionIndex, setSuggestionIndex] = useState(0);

    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([
        { id: 1, userName: "Nguyễn Văn A", rating: 5, comment: "Sơn rất đẹp, màu sắc trung thực.", date: "2024-03-15" },
        { id: 2, userName: "Trần Thị B", rating: 4, comment: "Độ che phủ tốt, mùi nhẹ.", date: "2024-03-10" }
    ]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (slug) {
            const found = PRODUCTS.find(p => p.slug === slug);
            setProduct(found || null);

            // Get related products (same category, different id)
            if (found) {
                const related = PRODUCTS.filter(p => p.category === found.category && p.id !== found.id);
                setRelatedProducts(related);
            }
        }
        setSuggestionIndex(0);
        window.scrollTo(0, 0);
    }, [slug]);

    const nextSuggestions = () => {
        if (relatedProducts.length > 2) {
            setSuggestionIndex((prev) => (prev + 1) % (relatedProducts.length - 1));
        }
    };

    const prevSuggestions = () => {
        if (relatedProducts.length > 2) {
            setSuggestionIndex((prev) => (prev - 1 + (relatedProducts.length - 1)) % (relatedProducts.length - 1));
        }
    };

    const displayedSuggestions = relatedProducts.slice(suggestionIndex, suggestionIndex + 2);

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        const review: Review = {
            id: Date.now(),
            userName: user?.name || "Người dùng",
            rating: newRating,
            comment: newComment,
            date: new Date().toISOString().split('T')[0]
        };

        setReviews([review, ...reviews]);
        setNewComment("");
        setNewRating(5);
        alert("Cảm ơn bạn đã đánh giá!");
    };

    if (!product) {
        return (
            <div className="np-app">
                <Header />
                <div className="np-container" style={{ padding: '40px 0', textAlign: 'center', minHeight: '50vh' }}>
                    <h2>Không tìm thấy sản phẩm</h2>
                    <Link to="/san-pham" className="np-btn-primary">Quay lại danh sách</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const handleAddToCart = async () => {
        if (product) {
            await addToCart(product.id, quantity);
            alert(`Đã thêm ${quantity} hộp ${product.name} vào giỏ hàng!`);
        }
    };

    return (
        <div className="np-app">
            <Header />

            <main className="np-main">
                <Breadcrumb items={[
                    { label: 'Trang chủ', link: '/' },
                    { label: 'Sản phẩm', link: '/san-pham' },
                    { label: product.name }
                ]} />

                <div className="np-product-detail-page">
                    <div className="np-container">
                        {/* Top Section: Image & Info */}
                        <div className="np-pd-top-section">
                            <div className="np-pd-image-col">
                                <div className="np-pd-image-wrapper">
                                    <img src={product.image} alt={product.name} />
                                    {product.isNew && <span className="np-badge-new">MỚI</span>}
                                    {product.isPremium && <span className="np-badge-premium">CAO CẤP</span>}
                                </div>
                            </div>

                            <div className="np-pd-info-col">
                                <div className="np-pd-category">{product.category}</div>
                                <h1 className="np-pd-title">{product.name}</h1>
                                <p className="np-pd-short-desc">{product.description}</p>

                                <div className="np-pd-price-row">
                                    <div className="np-pd-price">
                                        {product.price.toLocaleString('vi-VN')} ₫
                                    </div>
                                    <span className="np-pd-unit">/ Lon 5L</span>
                                </div>

                                <div className="np-pd-actions">
                                    <div className="np-quantity-selector">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        />
                                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                    </div>
                                    <button className="np-btn-add-cart" onClick={handleAddToCart}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                            <circle cx="9" cy="21" r="1" />
                                            <circle cx="20" cy="21" r="1" />
                                        </svg>
                                        THÊM VÀO GIỎ
                                    </button>
                                </div>

                                {/* Key Features List */}
                                <div className="np-pd-features">
                                    <h3>Đặc điểm nổi bật:</h3>
                                    <ul>
                                        {product.features.map((feature, idx) => (
                                            <li key={idx}>
                                                <span className="check-icon">✓</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Details Tabs */}
                        <div className="np-pd-details-section">
                            <div className="np-pd-tabs">
                                <button
                                    className={`np-pd-tab ${activeTab === 'info' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('info')}
                                >
                                    THÔNG TIN SẢN PHẨM
                                </button>
                                <button
                                    className={`np-pd-tab ${activeTab === 'system' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('system')}
                                >
                                    HỆ THỐNG SƠN ĐỀ NGHỊ
                                </button>
                                <button
                                    className={`np-pd-tab ${activeTab === 'data' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('data')}
                                >
                                    DỮ LIỆU THI CÔNG
                                </button>
                                <button
                                    className={`np-pd-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    ĐÁNH GIÁ ({reviews.length})
                                </button>
                            </div>

                            <div className="np-pd-tab-content">
                                {activeTab === 'info' && (
                                    <div className="np-pd-info-tab">
                                        <div className="np-info-row">
                                            <div className="np-info-label">Đặc điểm</div>
                                            <div className="np-info-value">
                                                <div className="np-info-subtitle">Đặc điểm:</div>
                                                <ul className="np-info-list">
                                                    {product.benefits ? product.benefits.map((b, i) => (
                                                        <li key={i}>- {b}</li>
                                                    )) : (
                                                        <>
                                                            <li>- Nhanh khô</li>
                                                            <li>- Kinh tế và dễ sử dụng</li>
                                                            <li>- Độ bám dính rất tốt trên nhiều bề mặt</li>
                                                            <li>- Màng sơn phẳng mịn</li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'system' && (
                                    <div className="np-pd-info-tab">
                                        <div className="np-info-row">
                                            <div className="np-info-label">Hệ thống sơn</div>
                                            <div className="np-info-value">
                                                <p>Vui lòng liên hệ bộ phận kỹ thuật để được tư vấn hệ thống sơn phù hợp nhất cho công trình của bạn.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'data' && (
                                    <div className="np-pd-info-tab">
                                        <div className="np-info-row">
                                            <div className="np-info-label">Dữ liệu thi công</div>
                                            <div className="np-info-value">
                                                {product.technicalData ? (
                                                    <table className="np-tech-table-v2">
                                                        <tbody>
                                                            <tr>
                                                                <th>Thời gian khô:</th>
                                                                <td>{product.technicalData.dryingTime}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Số lớp sơn:</th>
                                                                <td>{product.technicalData.coats} lớp</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Độ phủ lý thuyết:</th>
                                                                <td>{product.technicalData.coverage}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p>Vui lòng tham khảo Tài liệu kỹ thuật của sản phẩm để biết thêm chi tiết.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="np-pd-reviews-tab">
                                        <div className="np-reviews-container">
                                            {/* Submit Review */}
                                            <div className="np-submit-review">
                                                <h3>Đánh giá sản phẩm</h3>
                                                {isAuthenticated ? (
                                                    <form onSubmit={handleAddReview} className="np-review-form">
                                                        <div className="np-rating-select">
                                                            <span>Chọn đánh giá: </span>
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span
                                                                    key={star}
                                                                    className={`star ${newRating >= star ? 'filled' : ''}`}
                                                                    onClick={() => setNewRating(star)}
                                                                >★</span>
                                                            ))}
                                                        </div>
                                                        <textarea
                                                            placeholder="Nhận xét của bạn về sản phẩm..."
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            required
                                                        ></textarea>
                                                        <button type="submit" className="np-btn-submit-review">Gửi đánh giá</button>
                                                    </form>
                                                ) : (
                                                    <div className="np-review-auth-prompt">
                                                        <p>Vui lòng <Link to="/login">đăng nhập</Link> để gửi đánh giá sản phẩm.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Review List */}
                                            <div className="np-reviews-list">
                                                {reviews.length > 0 ? reviews.map(review => (
                                                    <div key={review.id} className="np-review-item">
                                                        <div className="np-review-header">
                                                            <div className="np-review-user">{review.userName}</div>
                                                            <div className="np-review-date">{review.date}</div>
                                                        </div>
                                                        <div className="np-review-rating">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <span key={s} className={`star ${review.rating >= s ? 'filled' : ''}`}>★</span>
                                                            ))}
                                                        </div>
                                                        <div className="np-review-comment">{review.comment}</div>
                                                    </div>
                                                )) : (
                                                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suggestions & Color Palettes */}
                        <div className="np-pd-suggestions-section">
                            <div className="np-suggestion-grid">
                                <div className="np-suggestion-col">
                                    <h2 className="np-suggestion-title">SẢN PHẨM GỢI Ý</h2>
                                    <div className="np-suggestion-cards">
                                        {displayedSuggestions.map(p => (
                                            <div key={p.id} className="np-suggestion-card">
                                                <div className="np-s-card-header">
                                                    <div className="np-s-compare">
                                                        <span className="np-s-radio"></span> SO SÁNH
                                                    </div>
                                                    <div className="np-s-wishlist">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="np-s-card-body">
                                                    <img src={p.image} alt={p.name} />
                                                    <div className="np-s-nav-arrow left" onClick={prevSuggestions}>‹</div>
                                                    <div className="np-s-nav-arrow right" onClick={nextSuggestions}>›</div>
                                                </div>
                                                <div className="np-s-card-footer">
                                                    <div className="np-s-cat">{p.category.toUpperCase()}</div>
                                                    <Link to={`/san-pham/${p.slug}`} className="np-s-name">{p.name}</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="np-suggestion-col">
                                    <h2 className="np-suggestion-title">BẢNG MÀU CHỌN LỌC</h2>
                                    <div className="np-suggestion-cards">
                                        <div className="np-suggestion-card catalog">
                                            <div className="np-s-card-body">
                                                <img src="https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/industrial-coating-catalogue.jpg" alt="Industrial Coatings" />
                                                <div className="np-s-nav-arrow left">‹</div>
                                            </div>
                                            <div className="np-s-card-footer">
                                                <div className="np-s-cat">BỘ SƯU TẬP SẮC MÀU</div>
                                                <div className="np-s-name">Sơn Phủ Công Nghiệp</div>
                                            </div>
                                        </div>
                                        <div className="np-suggestion-card catalog">
                                            <div className="np-s-card-body">
                                                <img src="https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/premium-product-catalogue.jpg" alt="Premium Products" />
                                                <div className="np-s-nav-arrow right">›</div>
                                            </div>
                                            <div className="np-s-card-footer">
                                                <div className="np-s-cat">BỘ SƯU TẬP SẮC MÀU</div>
                                                <div className="np-s-name">Sản Phẩm Cao Cấp</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetailPage;
