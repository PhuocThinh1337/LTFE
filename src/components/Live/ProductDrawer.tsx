import React, { useState } from 'react';
import { PRODUCTS, Product } from '../../data/products';
import { Voucher } from '../../data/vouchers';

interface ProductDrawerProps {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
    drawerTab: 'products' | 'vouchers';
    setDrawerTab: (tab: 'products' | 'vouchers') => void;
    onAddToCart: (product: Product, quantity: number) => void;
    onBuyNow: (product: Product, quantity: number) => void;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({
    isDrawerOpen,
    setIsDrawerOpen,
    drawerTab,
    setDrawerTab,
    onAddToCart,
    onBuyNow
}) => {
    const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});

    return (
        <>
            <div className={`product-drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>Danh sách {drawerTab === 'products' ? 'sản phẩm' : 'voucher'}</h3>
                    <button className="close-drawer-btn" onClick={() => setIsDrawerOpen(false)}>×</button>
                </div>

                {/* Drawer Tabs */}
                <div className="drawer-tabs">
                    <button
                        className={drawerTab === 'products' ? 'active' : ''}
                        onClick={() => setDrawerTab('products')}
                    >
                        Sản phẩm
                    </button>
                    <button
                        className={drawerTab === 'vouchers' ? 'active' : ''}
                        onClick={() => setDrawerTab('vouchers')}
                    >
                        Voucher 🎁
                    </button>
                </div>

                <div className="drawer-content">
                    {/* Products Tab */}
                    {drawerTab === 'products' && PRODUCTS.map(product => (
                        <div key={product.id} className="product-item">
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{product.price.toLocaleString()}đ</div>
                            </div>

                            {/* Audience Actions Block */}
                            <div className="product-actions-audience"
                                style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', minWidth: '85px' }}
                            >
                                {/* ROW 1: Quantity Selector */}
                                <div className="mini-quantity-selector" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <button
                                        onClick={() => setProductQuantities(prev => ({
                                            ...prev,
                                            [product.id]: Math.max(1, (prev[product.id] || 1) - 1)
                                        }))}
                                        style={{
                                            width: '28px', height: '28px', borderRadius: '4px', border: 'none',
                                            background: '#f1f2f6', color: '#000', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        -
                                    </button>
                                    <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '15px', textAlign: 'center', color: '#fff' }}>
                                        {productQuantities[product.id] || 1}
                                    </span>
                                    <button
                                        onClick={() => setProductQuantities(prev => ({
                                            ...prev,
                                            [product.id]: (prev[product.id] || 1) + 1
                                        }))}
                                        style={{
                                            width: '28px', height: '28px', borderRadius: '4px', border: 'none',
                                            background: '#f1f2f6', color: '#000', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* ROW 2: Action Buttons */}
                                <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                                    <button
                                        onClick={() => {
                                            const qty = productQuantities[product.id] || 1;
                                            onAddToCart(product, qty);
                                        }}
                                        style={{
                                            flex: 1, background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px',
                                            padding: '6px 0', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
                                        }}
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        onClick={() => {
                                            const qty = productQuantities[product.id] || 1;
                                            onBuyNow(product, qty);
                                        }}
                                        style={{
                                            flex: 1, background: '#ff4757', color: 'white', border: 'none', borderRadius: '4px',
                                            padding: '6px 0', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
                                        }}
                                    >
                                        Mua
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Vouchers Tab */}
                    {drawerTab === 'vouchers' && (() => {
                        const myVouchers = localStorage.getItem('my_vouchers');
                        const unlockedVouchers: Voucher[] = myVouchers ? JSON.parse(myVouchers) : [];

                        if (unlockedVouchers.length === 0) {
                            return (
                                <div style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#999'
                                }}>
                                    <p>Chưa có voucher nào</p>
                                    <p style={{ fontSize: '14px', marginTop: '10px' }}>
                                        Voucher sẽ xuất hiện khi Host tung trong live stream!
                                    </p>
                                </div>
                            );
                        }

                        return unlockedVouchers.map((voucher, idx) => (
                            <div
                                key={idx}
                                className="voucher-item"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                    letterSpacing: '1px'
                                }}>
                                    {voucher.code}
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    marginBottom: '12px',
                                    opacity: 0.9
                                }}>
                                    {voucher.description}
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(voucher.code);
                                        alert('✅ Đã copy mã voucher!');
                                    }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                >
                                    📋 Sao chép mã
                                </button>
                            </div>
                        ));
                    })()}
                </div>
            </div>

            {/* Backdrop */}
            {isDrawerOpen && <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)} />}
        </>
    );
};

export default ProductDrawer;
