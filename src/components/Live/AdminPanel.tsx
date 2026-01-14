import React from 'react';
import { PRODUCTS } from '../../data/products';
import { VOUCHERS, Voucher } from '../../data/vouchers';

interface AdminPanelProps {
    adminTab: 'products' | 'vouchers';
    setAdminTab: (tab: 'products' | 'vouchers') => void;
    pinnedProductId: number | null;
    handlePinProduct: (id: number) => void;
    activeVoucher: Voucher | null;
    onToggleVoucher: (voucher: Voucher) => void;
    onStopVoucher: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
    adminTab,
    setAdminTab,
    pinnedProductId,
    handlePinProduct,
    activeVoucher,
    onToggleVoucher,
    onStopVoucher
}) => {
    return (
        <div className="admin-panel host-panel">
            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={adminTab === 'products' ? 'active' : ''}
                    onClick={() => setAdminTab('products')}
                >
                    Sản phẩm
                </button>
                <button
                    className={adminTab === 'vouchers' ? 'active' : ''}
                    onClick={() => setAdminTab('vouchers')}
                >
                    Voucher 🎁
                </button>
            </div>

            {/* Product Tab Content */}
            {adminTab === 'products' && (
                <div className="host-product-list">
                    {PRODUCTS.map(product => (
                        <div
                            key={product.id}
                            className="product-item"
                            onClick={() => handlePinProduct(product.id)}
                            style={{ backgroundColor: pinnedProductId === product.id ? 'rgba(255, 71, 87, 0.3)' : 'transparent' }}
                        >
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{product.price.toLocaleString()}đ</div>
                            </div>
                            {pinnedProductId === product.id && <span className="pin-badge">PINNED</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* Voucher Tab Content */}
            {adminTab === 'vouchers' && (
                <div className="admin-list">
                    {VOUCHERS.filter(v => v.isLiveOnly).map(v => {
                        const isPushing = activeVoucher?.id === v.id;
                        return (
                            <div className={`admin-item ${isPushing ? 'active-warning' : ''}`} key={v.id}>
                                <div className="info">
                                    <strong>{v.code}</strong>
                                    <small>{v.description}</small>
                                </div>
                                <button
                                    className="btn-push"
                                    style={{ background: isPushing ? '#333' : '#e60012' }}
                                    onClick={() => {
                                        if (isPushing) {
                                            onStopVoucher();
                                        } else {
                                            onToggleVoucher(v);
                                        }
                                    }}
                                >
                                    {isPushing ? 'Dừng' : 'Tung'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
