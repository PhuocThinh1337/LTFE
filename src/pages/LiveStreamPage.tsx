import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAgora } from '../hooks/useAgora';
import { useLiveSession } from '../hooks/useLiveSession';
import { useLiveChat } from '../hooks/useLiveChat';
import { PRODUCTS, Product } from '../data/products';
import { updateFlashVoucher } from '../services/firebase';
import { PaintColor } from '../data/paintColors';
import ColorSelectionModal from '../components/common/ColorSelectionModal';
import VideoPlayer from '../components/Live/VideoPlayer';
import ChatSidebar from '../components/Live/ChatSidebar';
import ProductDrawer from '../components/Live/ProductDrawer';
import VoucherPopup from '../components/Live/VoucherPopup';
import AdminPanel from '../components/Live/AdminPanel';
import PinnedProductCard from '../components/Live/PinnedProductCard';
import './LiveStreamPage.css';

const LiveStreamPage: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    // UI State
    const [joined, setJoined] = useState(false);
    const [role, setRole] = useState<'host' | 'audience' | null>(null);
    const [adminTab, setAdminTab] = useState<'products' | 'vouchers'>('products');
    const [drawerTab, setDrawerTab] = useState<'products' | 'vouchers'>('products');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{ product: Product, quantity: number, type: 'add' | 'buy' } | null>(null);

    // Custom Hooks
    // 1. Session Hook (Manages isLive, Pinned Products, Viewers)
    const {
        pinnedProductId,
        isLive,
        setIsLive,
        viewerCount,
        activeVoucher,
        setActiveVoucher,
        handlePinProduct
    } = useLiveSession({ user, joined });

    // 2. Agora Hook (Manages AV, Connection)
    const {
        isCamOn,
        isMicOn,
        hostVideoRef,
        remoteVideoRef,
        joinChannel,
        leaveChannel,
        toggleCam,
        toggleMic
    } = useAgora({
        user,
        role,
        setRole,
        setIsLive,
        joined,
        setJoined
    });

    const {
        comments,
        commentInput,
        setCommentInput,
        handleSendComment
    } = useLiveChat({ role, user });

    // Handlers needed for interactions
    const requestAddToCart = (product: Product, quantity: number) => {
        if (!user) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            navigate('/login');
            return;
        }
        setPendingAction({ product, quantity, type: 'add' });
        setIsColorModalOpen(true);
    };

    const requestBuyNow = (product: Product, quantity: number) => {
        if (!user) {
            alert('Vui lòng đăng nhập để mua ngay');
            navigate('/login');
            return;
        }
        setPendingAction({ product, quantity, type: 'buy' });
        setIsColorModalOpen(true);
    };

    const handleColorSelect = async (color: PaintColor) => {
        if (!pendingAction) return;
        const { product, quantity, type } = pendingAction;
        const colorString = `${color.name} (${color.code})`;

        try {
            await addToCart(product.id, quantity, colorString);

            if (type === 'add') {
                alert(`Đã thêm ${quantity} hộp ${product.name} (Màu: ${color.name}) vào giỏ hàng!`);
            } else {
                const itemTotal = product.price * quantity;
                const shippingCost = itemTotal > 3000000 ? 0 : 100000;
                const checkoutItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    color: colorString
                };

                navigate('/thanh-toan', {
                    state: {
                        selectedItems: [checkoutItem],
                        subtotal: itemTotal,
                        shipping: shippingCost,
                        discount: 0,
                        voucher: null,
                        total: itemTotal + shippingCost
                    }
                });
            }
        } catch (error) {
            console.error('Error handling color select:', error);
            if ((error as any)?.message === 'AUTH_REQUIRED') {
                alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                navigate('/login');
                return;
            }
            alert('Có lỗi xảy ra.');
        } finally {
            setIsColorModalOpen(false);
            setPendingAction(null);
        }
    };

    const pinnedProduct = PRODUCTS.find(p => p.id === pinnedProductId);

    if (!joined) {
        return (
            <div className="join-wrapper">
                <h1>Live Stream Shopping</h1>
                <p>Xin chào, {user?.name || 'Khách'}</p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    {user?.role === 'admin' ? (
                        <button className="btn-primary" onClick={() => joinChannel('host')}>
                            {isLive ? "Tiếp tục Live (Reconnect)" : "Bắt đầu Live (Start)"}
                        </button>
                    ) : (
                        <button className="btn-secondary" onClick={() => joinChannel('audience')}>
                            Xem Live (Audience)
                        </button>
                    )}
                </div>

                <button
                    className="btn-secondary"
                    style={{ marginTop: '20px', background: 'transparent', color: 'white', border: '1px solid white' }}
                    onClick={() => navigate('/')}
                >
                    Quay lại Trang chủ
                </button>

                {isLive && user?.role === 'admin' && (
                    <p style={{ color: 'red', marginTop: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                        ⚠️ Phòng đang Live. Nếu bạn đang mở tab khác, vui lòng đóng tab này.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="live-stream-container">
            {/* LEFT: Video Area */}
            <div className="video-section">
                <VideoPlayer
                    role={role}
                    isLive={isLive}
                    viewerCount={viewerCount}
                    hostVideoRef={hostVideoRef}
                    remoteVideoRef={remoteVideoRef}
                >
                    {/* 1. Voucher Popup (Audience) */}
                    {activeVoucher && role === 'audience' && (
                        <VoucherPopup
                            activeVoucher={activeVoucher}
                            onClose={() => setActiveVoucher(null)}
                            role={role}
                        />
                    )}

                    {/* 2. Admin Panel (Host) */}
                    {role === 'host' && (
                        <AdminPanel
                            adminTab={adminTab}
                            setAdminTab={setAdminTab}
                            pinnedProductId={pinnedProductId}
                            handlePinProduct={handlePinProduct}
                            activeVoucher={activeVoucher}
                            onToggleVoucher={(voucher) => {
                                const unlockedVoucher = { ...voucher, startDate: new Date().toISOString() };
                                updateFlashVoucher(unlockedVoucher);
                            }}
                            onStopVoucher={() => updateFlashVoucher(null)}
                        />
                    )}

                    {/* 3. Shopping Buttons (Audience) */}
                    {role === 'audience' && (
                        <>
                            <button
                                className="shopping-bag-btn"
                                onClick={() => setIsDrawerOpen(true)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                <span className="bag-label">Mua sắm</span>
                            </button>

                            <button
                                className="cart-bag-btn"
                                onClick={() => navigate('/gio-hang')}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                <span className="bag-label">Giỏ hàng</span>
                            </button>
                        </>
                    )}

                    {/* 4. Pinned Product Card */}
                    {pinnedProduct && (
                        <PinnedProductCard
                            product={pinnedProduct}
                            onAddToCart={requestAddToCart}
                            onBuyNow={requestBuyNow}
                        />
                    )}

                    {/* 5. Control Buttons */}
                    <div className="live-controls">
                        <div className="control-group">
                            {role === 'host' && (
                                <>
                                    <button className={`control-btn ${!isMicOn ? 'mic-off' : ''}`} onClick={toggleMic}>
                                        {isMicOn ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path></svg>
                                        )}
                                    </button>
                                    <button className={`control-btn ${!isCamOn ? 'cam-off' : ''}`} onClick={toggleCam}>
                                        {isCamOn ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path></svg>
                                        )}
                                    </button>
                                </>
                            )}
                            <button className="control-btn leave" onClick={leaveChannel}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </button>
                        </div>
                    </div>
                </VideoPlayer>
            </div>

            {/* RIGHT: Chat Sidebar */}
            <ChatSidebar
                comments={comments}
                commentInput={commentInput}
                setCommentInput={setCommentInput}
                handleSendComment={handleSendComment}
            />

            {/* Product Drawer (Sidebar) */}
            <ProductDrawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                drawerTab={drawerTab}
                setDrawerTab={setDrawerTab}
                onAddToCart={requestAddToCart}
                onBuyNow={requestBuyNow}
            />

            {/* Color Modal */}
            <ColorSelectionModal
                isOpen={isColorModalOpen}
                onClose={() => setIsColorModalOpen(false)}
                onSelect={handleColorSelect}
                productName={pendingAction?.product.name || ''}
            />
        </div>
    );
};

export default LiveStreamPage;
