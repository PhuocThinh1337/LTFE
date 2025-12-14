import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { PRODUCTS } from '../data/products';
import { Link } from 'react-router-dom';

function WishlistPage(): React.JSX.Element {
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
            setWishlistIds(JSON.parse(stored));
        }
    }, []);

    const likedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

    // Toggle wishlist (remove functionality for this page effectively)
    const toggleWishlist = (id: number) => {
        const newIds = wishlistIds.filter(wid => wid !== id);
        setWishlistIds(newIds);
        localStorage.setItem('wishlist', JSON.stringify(newIds));
    };

    return (
        <div className="np-app">
            <Header />
            <main className="np-main">
                {/* Title Section */}
                <div style={{
                    textAlign: 'center',
                    padding: '40px 0 20px',
                    background: '#fff'
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        textTransform: 'uppercase',
                        color: '#333',
                        marginBottom: '10px',
                        fontWeight: '700'
                    }}>YÊU THÍCH</h1>
                    <p style={{
                        color: '#666',
                        fontSize: '16px'
                    }}>Nơi lưu trữ mã màu và sản phẩm yêu thích của bạn.</p>
                </div>

                {/* Tabs */}
                <div style={{
                    borderBottom: '1px solid #eee',
                    marginBottom: '40px',
                    background: '#fff'
                }}>
                    <div className="np-container" style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                        <div style={{
                            padding: '15px 0',
                            borderBottom: '2px solid #e60012',
                            color: '#e60012',
                            fontWeight: '700',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '14px'
                        }}>
                            Sản phẩm yêu thích
                        </div>
                        <div style={{
                            padding: '15px 0',
                            borderBottom: '2px solid transparent',
                            color: '#666',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '14px'
                        }}>
                            Mã màu sơn yêu thích
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="np-container" style={{ paddingBottom: '80px' }}>
                    {likedProducts.length > 0 ? (
                        <div className="np-products-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '30px'
                        }}>
                            {likedProducts.map(product => (
                                <div key={product.id} className="np-product-card" style={{
                                    background: '#fff',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.3s ease',
                                    border: '1px solid #eee',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {/* Card Actions */}
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
                                            background: '#e5e7eb',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: '#4b5563',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer',
                                            pointerEvents: 'auto'
                                        }}>
                                            <span style={{
                                                width: '14px',
                                                height: '14px',
                                                border: '1px solid currentColor',
                                                borderRadius: '50%',
                                                display: 'block'
                                            }}></span>
                                            SO SÁNH
                                        </div>
                                        <div
                                            onClick={() => toggleWishlist(product.id)}
                                            style={{
                                                cursor: 'pointer',
                                                color: '#e60012', // Always red in wishlist page mostly, or user can unlike
                                                pointerEvents: 'auto'
                                            }}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div style={{ height: '240px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', position: 'relative' }}>
                                        <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        {product.isNew && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '10px',
                                                background: '#e60012',
                                                color: 'white',
                                                fontSize: '10px',
                                                padding: '4px 8px',
                                                borderRadius: '50%',
                                                fontWeight: '700',
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                            }}>
                                                MỚI
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ padding: '20px', background: '#f9f9f9', borderTop: '1px solid #eee', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 10px', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {product.name}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', height: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {product.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <strong style={{ color: '#d32f2f', fontSize: '16px' }}>
                                                {product.price.toLocaleString('vi-VN')} ₫
                                            </strong>
                                            <button style={{
                                                background: 'transparent',
                                                border: '1px solid #d32f2f',
                                                color: '#d32f2f',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                textTransform: 'uppercase'
                                            }}>
                                                Xem ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                            Chưa có sản phẩm nào trong danh sách yêu thích.
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
}

export default WishlistPage;
