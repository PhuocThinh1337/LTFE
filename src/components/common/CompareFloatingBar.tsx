import React from 'react';
import { useCompare } from '../../contexts/CompareContext';
import { Link } from 'react-router-dom';
import './CompareFloatingBar.css';

const CompareFloatingBar: React.FC = () => {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) return null;

    return (
        <div className="np-compare-bar">
            <div className="np-container np-compare-bar-inner">
                <div className="np-compare-list">
                    {compareList.map(product => (
                        <div key={product.id} className="np-compare-item-preview">
                            <img src={product.image} alt={product.name} />
                            <div className="np-compare-info">
                                <Link to={`/san-pham/${product.slug}`} className="np-compare-name">{product.name}</Link>
                                <span className="np-compare-remove" onClick={() => removeFromCompare(product.id)}>XOÁ</span>
                            </div>
                        </div>
                    ))}
                    {compareList.length < 3 && (
                        <div className="np-compare-placeholder">
                            <span>Sản phẩm so sánh</span>
                        </div>
                    )}
                </div>

                <div className="np-compare-actions">
                    <Link to="/so-sanh/san-pham" className="np-btn-compare-link">
                        BẢNG SO SÁNH
                        <span className="arrow-icon">→</span>
                    </Link>
                    <button className="np-compare-clear-all" onClick={clearCompare}>Xoá tất cả</button>
                </div>
            </div>
        </div>
    );
};

export default CompareFloatingBar;
