import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import './MegaMenu.css';

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
    const [activeCategory, setActiveCategory] = useState<string>('son-noi-that');

    // Filter products based on active category
    // We take the first 3 products of the category to display
    const filteredProducts = PRODUCTS
        .filter(p => p.category === activeCategory)
        .slice(0, 3);

    // Reset category when menu opens/closes? Optional.
    useEffect(() => {
        if (isOpen) {
            setActiveCategory('son-noi-that'); // Default to first category
        }
    }, [isOpen]);

    return (
        <div className={`np-mega-menu-overlay ${isOpen ? 'active' : ''}`} onMouseLeave={onClose}>
            <div className="np-container">
                <div className="np-mega-menu">
                    <div className="np-mega-menu-inner">
                        {/* Sidebar */}
                        <div className="np-mega-menu-sidebar">
                            <div className="np-menu-group">
                                <div className="np-menu-group-title">
                                    Sơn kiến trúc
                                    <span>^</span>
                                </div>
                                <div className="np-menu-group-items">
                                    <div
                                        className={`np-mega-menu-category ${activeCategory === 'son-noi-that' ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCategory('son-noi-that')}
                                    >
                                        <Link to="/son-noi-that" onClick={onClose} style={{ color: 'inherit', textDecoration: 'none', display: 'block', width: '100%' }}>
                                            Sơn nội thất
                                        </Link>
                                    </div>
                                    <div
                                        className={`np-mega-menu-category ${activeCategory === 'son-ngoai-that' ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCategory('son-ngoai-that')}
                                    >
                                        <Link to="/son-ngoai-that" onClick={onClose} style={{ color: 'inherit', textDecoration: 'none', display: 'block', width: '100%' }}>
                                            Sơn ngoại thất
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`np-mega-menu-category ${activeCategory === 'son-dan-dung' ? 'active' : ''}`}
                                onMouseEnter={() => setActiveCategory('son-dan-dung')}
                            >
                                <Link to="/son-dan-dung" onClick={onClose} style={{ color: 'inherit', textDecoration: 'none', display: 'block', width: '100%' }}>
                                    Sơn dân dụng
                                </Link>
                            </div>

                            <div
                                className={`np-mega-menu-category ${activeCategory === 'son-va-chat-phu-cong-nghiep' ? 'active' : ''}`}
                                onMouseEnter={() => setActiveCategory('son-va-chat-phu-cong-nghiep')}
                            >
                                <Link to="/son-va-chat-phu-cong-nghiep" onClick={onClose} style={{ color: 'inherit', textDecoration: 'none', display: 'block', width: '100%' }}>
                                    Sơn và chất phủ công nghiệp
                                </Link>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="np-mega-menu-content">
                            <div className="np-mega-menu-products">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="np-mm-product-card">
                                        <div className="np-mm-product-image-wrapper">
                                            <img src={product.image} alt={product.name} className="np-mm-product-image" />
                                            {product.isNew && <span className="np-badge-new">MỚI</span>}
                                        </div>

                                        <div className="np-mm-product-info">
                                            <h3 className="np-mm-product-name">{product.name}</h3>
                                            <p className="np-mm-product-desc">{product.description}</p>
                                            {/* Price is hidden via CSS but we keep structure if needed later */}
                                            <div className="np-mm-product-price">
                                                {product.price?.toLocaleString('vi-VN')} ₫
                                            </div>
                                            <Link to={`/san-pham`} className="np-mm-product-btn" onClick={onClose}>
                                                XEM NGAY
                                                <span className="np-btn-icon">→</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
