import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import './MegaMenu.css';

interface MegaMenuProps {
    active: boolean;
    onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ active, onClose }) => {
    const [activeCategory, setActiveCategory] = useState<string>('Sơn Nội Thất');

    const filteredProducts = PRODUCTS.filter(p => {
        // Normalization helper
        const normalize = (str: string) => str.toLowerCase().trim();
        const active = normalize(activeCategory);
        const pCat = normalize(p.category);

        // Exact match
        if (pCat === active) return true;

        // Group mapping logic if needed
        if (active === 'sơn kiến trúc') {
            return pCat === 'sơn nội thất' || pCat === 'sơn ngoại thất';
        }

        return false;
    }).slice(0, 3);

    if (!active) return null;

    return (
        <div className={`np-mega-menu-overlay ${active ? 'active' : ''}`} onMouseLeave={onClose}>
            <div className="np-container">
                <div className="np-mega-menu">
                    <div className="np-container np-mega-menu-inner">
                        {/* Categories Sidebar */}
                        <div className="np-mega-menu-sidebar">
                            <div className="np-menu-group">
                                <div className="np-menu-group-title">Sơn kiến trúc <span style={{ float: 'right' }}>^</span></div>
                                <div className="np-menu-group-items">
                                    <Link
                                        to="/son-noi-that"
                                        className={`np-mega-menu-category ${activeCategory === 'Sơn Nội Thất' ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCategory('Sơn Nội Thất')}
                                        onClick={onClose}
                                    >
                                        Sơn nội thất
                                    </Link>
                                    <Link
                                        to="/son-ngoai-that"
                                        className={`np-mega-menu-category ${activeCategory === 'Sơn Ngoại Thất' ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveCategory('Sơn Ngoại Thất')}
                                        onClick={onClose}
                                    >
                                        Sơn ngoại thất
                                    </Link>
                                </div>
                            </div>

                            <Link
                                to="/son-dan-dung"
                                className={`np-mega-menu-category ${activeCategory === 'Sơn dân dụng' ? 'active' : ''}`}
                                onMouseEnter={() => setActiveCategory('Sơn dân dụng')}
                                onClick={onClose}
                            >
                                Sơn dân dụng
                            </Link>

                            <Link
                                to="/son-va-chat-phu-cong-nghiep"
                                className={`np-mega-menu-category ${activeCategory === 'Sơn và chất phủ công nghiệp' ? 'active' : ''}`}
                                onMouseEnter={() => setActiveCategory('Sơn và chất phủ công nghiệp')}
                                onClick={onClose}
                            >
                                Sơn và chất phủ công nghiệp
                            </Link>

                        </div>

                        {/* Products Grid */}
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
