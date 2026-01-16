import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { PRODUCTS, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCompare } from '../contexts/CompareContext';
import './ProductDetailPage.css';
import catalogTilac from '../img/nippon_catalogs/Sơn_Dầu_Cao_Cấp_Tilac.pdf';
import catalogMatex from '../img/nippon_catalogs/Sơn_Matex_và_Supper_Matex.pdf';
import catalogIndustrial from '../img/nippon_catalogs/Sơn_Phủ_Công_Nghiệp.pdf';
import catalogVatex from '../img/nippon_catalogs/Sơn_Vatex.pdf';

import catalogPremium from '../img/nippon_catalogs/Sản_Phẩm_Cao_Cấp_-_Cloned.pdf';
import ColorSelectionModal from '../components/common/ColorSelectionModal';
import { PAINT_COLORS, PaintColor } from '../data/paintColors';

// ... (rest of imports)

// ...


interface SuggestionCardProps {
    product: Product;
    onPrev: () => void;
    onNext: () => void;
}


const SuggestionCard: React.FC<SuggestionCardProps> = ({ product, onPrev, onNext }) => {
    const { addToCompare, removeFromCompare, isInCompare } = useCompare();
    const isCompared = isInCompare(product.id);

    return (
        <div className="np-suggestion-card">
            <div className="np-s-card-header">
                <div
                    className="np-s-compare"
                    onClick={() => isCompared ? removeFromCompare(product.id) : addToCompare(product)}
                    style={{ cursor: 'pointer', background: isCompared ? '#e60012' : '#f5f5f5', color: isCompared ? '#fff' : '#666' }}
                >
                    <span className="np-s-radio" style={{ background: isCompared ? '#fff' : '#fff', borderColor: isCompared ? '#fff' : '#ccc' }}>
                        {isCompared && <span style={{ display: 'block', width: '8px', height: '8px', background: '#e60012', borderRadius: '50%', margin: '2px' }}></span>}
                    </span> SO SÁNH
                </div>
                <div className="np-s-wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
            </div>
            <div className="np-s-card-body">
                <img src={product.image} alt={product.name} />
                <div className="np-s-nav-arrow left" onClick={onPrev}>‹</div>
                <div className="np-s-nav-arrow right" onClick={onNext}>›</div>
            </div>
            <div className="np-s-card-footer">
                <div className="np-s-cat">{product.category.toUpperCase()}</div>
                <Link to={`/san-pham/${product.slug}`} className="np-s-name">{product.name}</Link>
            </div>
        </div>
    );
};

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

const ProductDetailPage: React.FC = () => {
    // State
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

    // Variant State
    const [selectedVolume, setSelectedVolume] = useState<string>('');
    const [selectedColorName, setSelectedColorName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);

    // Derived lists for selectors
    const availableVolumes = product?.variants
        ? Array.from(new Set(product.variants.map(v => v.volume)))
        : [];

    const availableColors = product?.variants
        ? Array.from(new Set(product.variants.filter(v => v.volume === selectedVolume).map(v => v.color)))
        : [];

    // Helper: Base price calculation for selected volume
    const getBasePriceForVolume = (vol: string) => {
        if (product && product.variants) {
            // Try to find a standard color variant (e.g. "Trắng") for this volume
            const standard = product.variants.find(v => v.volume === vol && v.color === 'Trắng');
            if (standard) return standard.price;

            // Or just find the first/min price for this volume
            const variantsForVol = product.variants.filter(v => v.volume === vol);
            if (variantsForVol.length > 0) {
                return Math.min(...variantsForVol.map(v => v.price));
            }
        }
        return product ? product.price : 0;
    };

    // Calculate base price for the Modal (to show correct estimated prices)
    const currentVolumeBasePrice = getBasePriceForVolume(selectedVolume);

    useEffect(() => {
        if (product) {
            if (product.variants && product.variants.length > 0) {
                // Set defaults if not set, or reset if product changed
                const first = product.variants[0];
                setSelectedVolume(first.volume);
                setSelectedColorName(first.color);
                setPrice(first.price);
                setStock(first.stock !== undefined ? first.stock : (product.stock || 0)); // Set initial stock
            } else {
                setPrice(product.price);
                setStock(product.stock || 0); // Set initial stock for products without variants
            }
        }
    }, [product]);

    // Update Price & Stock Logic
    useEffect(() => {
        if (!product) return;

        let currentPrice = 0;
        let currentStock = 0;

        // 1. Try to find exact variant match (Pre-defined variants in products.ts)
        if (product.variants) {
            const variant = product.variants.find(v => v.volume === selectedVolume && v.color === selectedColorName);
            if (variant) {
                currentPrice = variant.price;
                currentStock = variant.stock !== undefined ? variant.stock : (product.stock || 0);
            } else {
                // 2. If no exact predefined match (Custom Color), calculate based on base price + factor
                // For stock, we assume we use the 'Trắng' variant as the base for tinting
                const baseVariant = product.variants.find(v => v.volume === selectedVolume && v.color === 'Trắng');
                currentStock = baseVariant?.stock !== undefined ? baseVariant.stock : (product.stock || 0);

                // Price logic for custom colors
                const basePrice = getBasePriceForVolume(selectedVolume);
                const customColor = PAINT_COLORS.find(c => c.name === selectedColorName);

                if (customColor && customColor.priceFactor) {
                    currentPrice = Math.round(basePrice * customColor.priceFactor / 1000) * 1000;
                } else {
                    currentPrice = basePrice;
                }
            }
        } else {
            // No variants defined for the product, use product's base price and stock
            currentPrice = product.price;
            currentStock = product.stock || 0;
        }

        setPrice(currentPrice);
        setStock(currentStock);

    }, [selectedVolume, selectedColorName, product]);

    const handleColorSelect = (color: PaintColor) => {
        setSelectedColorName(color.name);
        setIsColorModalOpen(false);
    };

    const handleAddToCart = async () => {
        if (stock === 0) {
            alert('Sản phẩm này đang tạm hết hàng.');
            return;
        }
        if (quantity > stock) {
            alert(`Xin lỗi, chỉ còn ${stock} sản phẩm trong kho.`);
            return;
        }

        if (product) {
            try {
                // Determine effective price is already in 'price' state
                const colorString = `${selectedColorName} (${selectedVolume})`;
                await addToCart(product.id, quantity, colorString, price);
                alert(`Đã thêm ${quantity} hộp ${product.name} (Màu: ${selectedColorName}, ${selectedVolume}) vào giỏ hàng!`);
            } catch (error) {
                console.error('Lỗi khi thêm vào giỏ hàng:', error);
                alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        }
    };
    const [catalogIndex, setCatalogIndex] = useState(0);

    const catalogs = [
        {
            id: 'c1',
            name: 'Sơn Phủ Công Nghiệp',
            image: 'https://nipponpaint.com.vn/sites/default/files/styles/webp/public/2019-02/bang-mau-son-phu-cong-nghiep_0.png.webp?itok=YLQEl0Me',
            file: catalogIndustrial
        },
        {
            id: 'c2',
            name: 'Sản Phẩm Cao Cấp',
            image: 'https://nipponpaint.com.vn/sites/default/files/styles/webp/public/2019-02/bang-mau-san-pham-cao-cap_0.png.webp?itok=OOGrVDnn',
            file: catalogPremium
        },
        {
            id: 'c3',
            name: 'Sơn Vatex',
            image: PRODUCTS.find(p => p.name.includes('Vatex'))?.image || PRODUCTS[0].image,
            file: catalogVatex
        },
        {
            id: 'c4',
            name: 'Sơn Matex & Super Matex',
            image: PRODUCTS.find(p => p.name.includes('Matex'))?.image || PRODUCTS[0].image,
            file: catalogMatex
        },
        {
            id: 'c5',
            name: 'Sơn Dầu Cao Cấp Tilac',
            image: PRODUCTS.find(p => p.name.includes('Tilac'))?.image || PRODUCTS[0].image,
            file: catalogTilac
        }
    ];

    const nextCatalog = () => {
        if (catalogs.length > 2) {
            setCatalogIndex((prev) => (prev + 1) % catalogs.length);
        }
    };

    const prevCatalog = () => {
        if (catalogs.length > 2) {
            setCatalogIndex((prev) => (prev - 1 + catalogs.length) % catalogs.length);
        }
    };

    // Circular slice for carousel (always show 2)
    const getDisplayedCatalogs = () => {
        const list = [];
        for (let i = 0; i < 2; i++) {
            list.push(catalogs[(catalogIndex + i) % catalogs.length]);
        }
        return list;
    };

    const displayedCatalogs = getDisplayedCatalogs();

    useEffect(() => {
        if (slug) {
            const found = PRODUCTS.find(p => p.slug === slug);

            if (found) {
                // Determine if we need to generate default variants
                // Assuming standard paint volumes: 1L, 5L (base), 18L
                let productWithVariants = { ...found };

                if (!found.variants || found.variants.length === 0) {
                    const basePrice = found.price; // Assume price is for 5L

                    // Simple logic to generate price variants
                    const price1L = Math.round((basePrice / 5) * 1.2 / 1000) * 1000;
                    const price18L = Math.round((basePrice / 5) * 18 * 0.9 / 1000) * 1000;

                    productWithVariants.variants = [
                        { volume: "1L", color: "Trắng", price: price1L },
                        { volume: "5L", color: "Trắng", price: basePrice },
                        { volume: "18L", color: "Trắng", price: price18L },

                        // Add some common colors
                        { volume: "1L", color: "Xám Ghi", price: price1L + 20000 },
                        { volume: "5L", color: "Xám Ghi", price: basePrice + 50000 },
                        { volume: "18L", color: "Xám Ghi", price: price18L + 150000 },

                        { volume: "1L", color: "Kem", price: price1L + 10000 },
                        { volume: "5L", color: "Kem", price: basePrice + 30000 },
                        { volume: "18L", color: "Kem", price: price18L + 100000 },
                    ];
                }

                setProduct(productWithVariants);

                // Get related products (same category, different id)
                const related = PRODUCTS.filter(p => p.category === found.category && p.id !== found.id);
                setRelatedProducts(related);
            } else {
                setProduct(null);
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
                                        {price.toLocaleString('vi-VN')} ₫
                                    </div>
                                    <span className="np-pd-unit">/ {selectedVolume ? selectedVolume : 'Lon 5L'}</span>
                                </div>
                                <div className={`np-pd-stock ${stock > 0 ? 'in-stock' : 'out-of-stock'}`} style={{ marginTop: '10px', fontSize: '14px', fontWeight: '500', color: stock > 0 ? '#28a745' : '#dc3545' }}>
                                    {stock > 0 ? `✓ Còn hàng (Tồn kho: ${stock})` : '✕ Tạm hết hàng'}
                                </div>

                                {/* Variant Selectors */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="np-variant-selector">
                                        <div className="np-selector-group">
                                            <label>Thể tích:</label>
                                            <div className="np-volume-options">
                                                {availableVolumes.map(vol => (
                                                    <button
                                                        key={vol}
                                                        className={`np-volume-btn ${selectedVolume === vol ? 'active' : ''}`}
                                                        onClick={() => setSelectedVolume(vol)}
                                                    >
                                                        {vol}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="np-selector-group">
                                            <label>Màu sắc:</label>
                                            <div className="np-color-options">
                                                {availableColors.map(col => (
                                                    <button
                                                        key={col}
                                                        className={`np-color-btn ${selectedColorName === col ? 'active' : ''}`}
                                                        onClick={() => setSelectedColorName(col)}
                                                    >
                                                        {col}
                                                    </button>
                                                ))}
                                                <button
                                                    className={`np-color-btn ${!availableColors.includes(selectedColorName) ? 'active' : ''}`}
                                                    onClick={() => setIsColorModalOpen(true)}
                                                    style={{ borderStyle: 'dashed' }}
                                                >
                                                    <span style={{ marginRight: '5px' }}>🎨</span>
                                                    {availableColors.includes(selectedColorName) ? 'Màu khác...' : selectedColorName}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                            <SuggestionCard
                                                key={p.id}
                                                product={p}
                                                onPrev={prevSuggestions}
                                                onNext={nextSuggestions}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="np-suggestion-col">
                                    <h2 className="np-suggestion-title">BẢNG MÀU CHỌN LỌC</h2>
                                    <div className="np-suggestion-cards">
                                        {displayedCatalogs.map((cat, idx) => (
                                            <div key={cat.id} className="np-suggestion-card catalog">
                                                <div className="np-s-card-body" style={{ cursor: 'pointer' }} onClick={() => window.open(cat.file, '_blank')}>
                                                    <img src={cat.image} alt={cat.name} style={{ objectFit: 'cover' }} />
                                                    {/* Show arrows on hover or always? Mimic suggestion card logic */}
                                                    {idx === 0 && <div className="np-s-nav-arrow left" onClick={(e) => { e.stopPropagation(); prevCatalog(); }}>‹</div>}
                                                    {idx === 1 && <div className="np-s-nav-arrow right" onClick={(e) => { e.stopPropagation(); nextCatalog(); }}>›</div>}
                                                </div>
                                                <div className="np-s-card-footer">
                                                    <div className="np-s-cat">BỘ SƯU TẬP SẮC MÀU</div>
                                                    <div className="np-s-name" onClick={() => window.open(cat.file, '_blank')} style={{ cursor: 'pointer' }}>{cat.name}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ColorSelectionModal
                isOpen={isColorModalOpen}
                onClose={() => setIsColorModalOpen(false)}
                onSelect={handleColorSelect}
                productName={product?.name || ''}
                basePrice={currentVolumeBasePrice}
            />

            <Footer />
        </div>
    );
};

export default ProductDetailPage;
