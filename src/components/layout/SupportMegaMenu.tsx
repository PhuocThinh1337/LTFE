import React from 'react';
import { Link } from 'react-router-dom';
import './MegaMenu.css';
import paintCalcImg from '../../assets/paint-calculator.png';
import colorSupportImg from '../../assets/color-support.png';

interface SupportMegaMenuProps {
    active: boolean;
    onClose: () => void;
}

const SupportMegaMenu: React.FC<SupportMegaMenuProps> = ({ active, onClose }) => {
    if (!active) return null;

    return (
        <div className={`np-mega-menu-overlay ${active ? 'active' : ''}`} onClick={onClose}>
            <div className="np-container">
                <div className="np-mega-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="np-container np-mega-menu-inner">
                        {/* Sidebar */}
                        <div className="np-mega-menu-sidebar">
                            <div className="np-menu-group">
                                <div className="np-menu-group-items" style={{ paddingLeft: 0 }}>
                                    <Link
                                        to="/tinh-toan-luong-son"
                                        className="np-mega-menu-category"
                                        style={{ display: 'block', padding: '8px 0', textDecoration: 'none' }}
                                        onClick={onClose}
                                    >
                                        Tính toán lượng sơn
                                    </Link>

                                    <Link
                                        to="/ho-tro-phoi-mau"
                                        className="np-mega-menu-category"
                                        style={{ display: 'block', padding: '8px 0', textDecoration: 'none' }}
                                        onClick={onClose}
                                    >
                                        Hỗ trợ phối màu
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="np-mega-menu-content">
                            <div className="np-mega-menu-products" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                {/* Calculator Card */}
                                <div className="np-mm-product-card">
                                    <div className="np-mm-product-image-wrapper">
                                        <img src={paintCalcImg} alt="Tính toán lượng sơn" className="np-mm-product-image" />
                                    </div>
                                    <div className="np-mm-product-info">
                                        <h3 className="np-mm-product-name">Tính toán lượng sơn</h3>
                                        <p className="np-mm-product-desc">
                                            Công cụ tham khảo giúp dự toán lượng sơn cần thiết cho công trình
                                        </p>
                                        <Link to="/tinh-toan-luong-son" className="np-mm-product-btn" onClick={onClose}>
                                            XEM NGAY
                                            <span className="np-btn-icon">→</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Color Support Card */}
                                <div className="np-mm-product-card">
                                    <div className="np-mm-product-image-wrapper">
                                        <img src={colorSupportImg} alt="Hỗ trợ phối màu" className="np-mm-product-image" />
                                    </div>
                                    <div className="np-mm-product-info">
                                        <h3 className="np-mm-product-name">Hỗ trợ phối màu</h3>
                                        <p className="np-mm-product-desc">
                                            Gửi kèm ảnh chụp toàn cảnh ngôi nhà/ công trình của bạn để nhận bản phối màu miễn phí
                                        </p>
                                        <Link to="/ho-tro-phoi-mau" className="np-mm-product-btn" onClick={onClose}>
                                            XEM NGAY
                                            <span className="np-btn-icon">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportMegaMenu;
