import React, { useState, useEffect } from 'react';
import { Product } from '../../data/products';

interface PinnedProductCardProps {
    product: Product;
    onAddToCart: (product: Product, quantity: number) => void;
    onBuyNow: (product: Product, quantity: number) => void;
}

const PinnedProductCard: React.FC<PinnedProductCardProps> = ({ product, onAddToCart, onBuyNow }) => {
    const [buyQuantity, setBuyQuantity] = useState(1);

    // Reset quantity when product changes
    useEffect(() => {
        setBuyQuantity(1);
    }, [product.id]);

    return (
        <div className="pinned-product-card">
            <img src={product.image} alt={product.name} className="pinned-image" />
            <div className="pinned-details">
                <h3>{product.name}</h3>
                <div className="pinned-price">{product.price.toLocaleString()}đ</div>
                <div className="quantity-selector">
                    <button onClick={() => setBuyQuantity(q => Math.max(1, q - 1))}>-</button>
                    <span>{buyQuantity}</span>
                    <button onClick={() => setBuyQuantity(q => q + 1)}>+</button>
                </div>
                <div className="action-buttons">
                    <button className="add-cart-btn" onClick={() => onAddToCart(product, buyQuantity)}>Thêm</button>
                    <button className="buy-now-btn" onClick={() => onBuyNow(product, buyQuantity)}>Mua</button>
                </div>
            </div>
        </div>
    );
};

export default PinnedProductCard;
