import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../data/products';
import { PAINT_COLORS, PaintColor } from '../../data/paintColors';
import './QuickBuyModal.css';

interface QuickBuyModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    initialQuantity?: number;
    initialActionType?: 'add' | 'buy';
    onConfirm: (product: Product, quantity: number, colorName: string, price: number, actionType: 'add' | 'buy') => void;
}

const QuickBuyModal: React.FC<QuickBuyModalProps> = ({
    isOpen,
    onClose,
    product,
    initialQuantity = 1,
    initialActionType = 'add',
    onConfirm
}) => {
    // State
    const [quantity, setQuantity] = useState(initialQuantity);
    const [selectedVolume, setSelectedVolume] = useState<string>('');
    const [selectedColorName, setSelectedColorName] = useState<string>('');
    const [showCustomColors, setShowCustomColors] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Update quantity when prop changes
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    // Init Logic on Product Open
    useEffect(() => {
        if (product && isOpen) {
            // Find default variant
            if (product.variants && product.variants.length > 0) {
                const first = product.variants[0];
                setSelectedVolume(first.volume);
                setSelectedColorName(first.color);
            } else {
                // No variants? Handle graceful or assume standards
                setSelectedVolume('5L');
                setSelectedColorName('Trắng');
            }
            setShowCustomColors(false);
        }
    }, [product, isOpen]);

    // Derived Logic
    const availableVolumes = useMemo(() => {
        if (!product || !product.variants) return ['5L', '18L']; // fallback
        return Array.from(new Set(product.variants.map(v => v.volume)));
    }, [product]);

    const standardColors = useMemo(() => {
        if (!product || !product.variants) return ['Trắng'];
        // Filter colors available for ALL selected volumes? Or just colors associated with volume
        // Usually colors are independent, but let's list colors that exist in variants for this volume
        const variantsForVol = product.variants.filter(v => v.volume === selectedVolume);
        const colors = Array.from(new Set(variantsForVol.map(v => v.color)));
        if (colors.length === 0) return ['Trắng'];
        return colors;
    }, [product, selectedVolume]);

    // Filtered Colors for Custom Search
    const filteredCustomColors = useMemo(() => {
        if (!searchTerm) return PAINT_COLORS.slice(0, 30); // show first 30
        return PAINT_COLORS.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 50);
    }, [searchTerm]);

    // Pricing & Stock Logic (Duplicated simplified logic from Detail Page)
    const { price, stock, isCustomColor } = useMemo(() => {
        if (!product) return { price: 0, stock: 0, isCustomColor: false };

        let currentPrice = 0;
        let currentStock = 0;
        let isCustom = false;

        if (product.variants) {
            const variant = product.variants.find(v => v.volume === selectedVolume && v.color === selectedColorName);
            if (variant) {
                currentPrice = variant.price;
                currentStock = variant.stock !== undefined ? variant.stock : (product.stock || 0);
            } else {
                // Custom Color Logic
                isCustom = true;
                const basePriceVariant = product.variants.find(v => v.volume === selectedVolume && v.color === 'Trắng'); // Use White as base price reference
                const basePrice = basePriceVariant ? basePriceVariant.price : (product.price || 0);

                // Find stock from base (White)
                const baseVariant = product.variants.find(v => v.volume === selectedVolume && v.color === 'Trắng');
                currentStock = baseVariant?.stock !== undefined ? baseVariant.stock : (product.stock || 0);

                // Calculate price factor
                const paintColor = PAINT_COLORS.find(c => c.name === selectedColorName);
                if (paintColor && paintColor.priceFactor) {
                    currentPrice = Math.round(basePrice * paintColor.priceFactor / 1000) * 1000;
                } else {
                    currentPrice = basePrice;
                }
            }
        } else {
            currentPrice = product.price;
            currentStock = product.stock || 0;
        }

        return { price: currentPrice, stock: currentStock, isCustomColor: isCustom };
    }, [product, selectedVolume, selectedColorName]);


    if (!isOpen || !product) return null;

    const handleConfirm = () => {
        if (stock <= 0) {
            alert('Sản phẩm tạm hết hàng!');
            return;
        }
        if (quantity > stock) {
            alert(`Chỉ còn ${stock} sản phẩm.`);
            return;
        }
        onConfirm(product, quantity, `${selectedColorName} (${selectedVolume})`, price, initialActionType);
        onClose();
    };

    return (
        <div className="quick-buy-modal-overlay" onClick={onClose}>
            <div className="quick-buy-modal-content" onClick={e => e.stopPropagation()}>
                <div className="qb-header">
                    <h3>Tùy chọn sản phẩm</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="qb-body">
                    {/* Product Summary */}
                    <div className="qb-product-summary">
                        <img src={product.image} alt={product.name} className="qb-product-img" />
                        <div className="qb-product-info">
                            <h4>{product.name}</h4>
                            <div className="qb-price">{price.toLocaleString('vi-VN')} ₫</div>
                            <div className={`qb-stock ${stock <= 0 ? 'out' : stock <= 20 ? 'low' : ''}`}>
                                {stock > 0 ? `Còn hàng: ${stock}` : 'Hết hàng'}
                            </div>
                        </div>
                    </div>

                    {/* Volume Selector */}
                    <div className="qb-selector-group">
                        <label className="qb-selector-label">Thể tích (Size):</label>
                        <div className="qb-options-row">
                            {availableVolumes.map(vol => (
                                <button
                                    key={vol}
                                    className={`qb-option-btn ${selectedVolume === vol ? 'active' : ''}`}
                                    onClick={() => setSelectedVolume(vol)}
                                >
                                    {vol}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div className="qb-selector-group">
                        <label className="qb-selector-label">Màu sắc:</label>
                        <div className="qb-options-row">
                            {standardColors.map(col => (
                                <button
                                    key={col}
                                    className={`qb-option-btn ${selectedColorName === col && !showCustomColors ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedColorName(col);
                                        setShowCustomColors(false);
                                    }}
                                >
                                    {col}
                                </button>
                            ))}
                        </div>

                        <button
                            className={`qb-custom-color-btn ${showCustomColors ? 'active' : ''}`}
                            onClick={() => setShowCustomColors(!showCustomColors)}
                        >
                            <span style={{ fontSize: '16px' }}>🎨</span>
                            {showCustomColors
                                ? 'Ẩn bảng màu tùy chọn'
                                : isCustomColor
                                    ? `Màu đang chọn: ${selectedColorName} (Nhấn để thay đổi)`
                                    : 'Chọn mã màu khác...'
                            }
                        </button>

                        {showCustomColors && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tìm màu..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '8px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    onClick={e => e.stopPropagation()}
                                />
                                <div className="qb-color-grid">
                                    {filteredCustomColors.map(c => (
                                        <div
                                            key={c.id}
                                            className="qb-color-item"
                                            onClick={() => {
                                                setSelectedColorName(c.name);
                                                // Don't close immediately, let user see selection?
                                                // Or maybe highlight it.
                                            }}
                                            style={{
                                                border: selectedColorName === c.name ? '2px solid #e60012' : 'none',
                                                padding: '2px',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            <div className="qb-color-swatch" style={{ backgroundColor: c.hex }}></div>
                                            <div className="qb-color-name" title={c.name}>{c.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="qb-footer">
                    <div className="qb-qty-selector">
                        <button className="qb-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <input type="text" className="qb-qty-input" value={quantity} readOnly />
                        <button className="qb-qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>

                    <button
                        className={`qb-action-btn ${initialActionType === 'buy' ? 'qb-btn-buy' : 'qb-btn-add'}`}
                        onClick={handleConfirm}
                        disabled={stock <= 0}
                        style={{ opacity: stock <= 0 ? 0.6 : 1, cursor: stock <= 0 ? 'not-allowed' : 'pointer' }}
                    >
                        {stock <= 0 ? 'HẾT HÀNG' : initialActionType === 'buy' ? 'MUA NGAY' : 'THÊM VÀO GIỎ'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickBuyModal;
