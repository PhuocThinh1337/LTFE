import React, { useState, useEffect, useRef } from 'react';
import { checkToxicContent } from '../services/moderation';
import { useNavigate } from 'react-router-dom';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { PRODUCTS, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { updatePinnedProduct, subscribeToPinnedProduct, updateStreamStatus, subscribeToStreamStatus, sendComment, subscribeToComments, clearChat, getStreamStatus, updateFlashVoucher, subscribeToFlashVoucher, trackViewer, removeViewer, subscribeToViewerCount } from '../services/firebase';
import { VOUCHERS, Voucher } from '../data/vouchers';
import './LiveStreamPage.css';

// --- CONFIGURATION ---
const APP_ID = process.env.REACT_APP_AGORA_APP_ID || "";
const CHANNEL_NAME = "ecommerce_live";
const TOKEN = null;

const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const LiveStreamPage: React.FC = () => {
    const [joined, setJoined] = useState(false);
    const [role, setRole] = useState<'host' | 'audience' | null>(null);
    const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const [pinnedProductId, setPinnedProductId] = useState<number | null>(null);
    const [isLive, setIsLive] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [comments, setComments] = useState<any[]>([]);
    const [commentInput, setCommentInput] = useState("");
    const [activeVoucher, setActiveVoucher] = useState<Voucher | null>(null);
    const [viewerCount, setViewerCount] = useState(0); // State lưu số mắt xem
    const [adminTab, setAdminTab] = useState<'products' | 'vouchers'>('products');
    const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastChatTime = useRef<number>(0);
    const currentViewerId = useRef<string | null>(null); // To store current viewer ID

    const navigate = useNavigate();

    const hostVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);

    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        if (joined && role === 'host' && localTracks && hostVideoRef.current) {
            localTracks[1].play(hostVideoRef.current);
        }
    }, [joined, role, localTracks]);

    useEffect(() => {
        // IMPORTANT: Clear old chat FIRST before subscribing
        localStorage.removeItem('live_comments');

        const unsubscribeProduct = subscribeToPinnedProduct((productId) => {
            setPinnedProductId(productId);
            setBuyQuantity(1);
        });

        const unsubscribeStatus = subscribeToStreamStatus((status) => {
            setIsLive(status);
        });

        const unsubscribeViewerCount = subscribeToViewerCount((count) => {
            setViewerCount(count);
        });

        // Subscribe to comments AFTER clearing
        const unsubscribeComments = subscribeToComments((newComments) => {
            setComments(newComments);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });

        const unsubscribeVoucher = subscribeToFlashVoucher((voucher) => {
            setActiveVoucher(voucher);
        });

        return () => {
            unsubscribeProduct();
            unsubscribeStatus();
            unsubscribeComments();
            unsubscribeVoucher();
            unsubscribeViewerCount();

            // Clean up viewer if component unmounts without clean exit
            if (currentViewerId.current) {
                removeViewer(currentViewerId.current);
            }
            // Don't call leaveChannel here to avoid dependency warning
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const joinChannel = async (selectedRole: 'host' | 'audience') => {
        try {
            // Clear chat when joining a new session
            localStorage.removeItem('live_comments');
            setComments([]);

            // --- VIEWER TRACKING ---
            const currentUid = user?.id ? `user_${user.id}` : `guest_${Math.floor(Math.random() * 100000)}`;
            const currentName = user?.name || 'Khách';
            currentViewerId.current = currentUid;
            trackViewer(currentUid, { name: currentName });
            // -----------------------

            if (selectedRole === 'host') {
                if (user?.role !== 'live') {
                    alert("Bạn không có quyền Host!");
                    return;
                }
                // QUAN TRỌNG: Kiểm tra xem có đang live không trước khi clear
                // QUAN TRỌNG: Kiểm tra xem có đang live không trước khi clear
                const remoteIsLive = await getStreamStatus();
                if (remoteIsLive) {
                    const confirmReconnect = window.confirm(
                        "Đang có phiên Live diễn ra! Bạn muốn tiếp tục (Reconnect) hay Xóa cũ tạo mới?\nOK: Reconnect\nCancel: Hủy"
                    );

                    if (!confirmReconnect) return;

                    console.log("Host đang Reconnect...");
                    // KHÔNG GỌI clearChat()
                    // KHÔNG GỌI updatePinnedProduct(null)
                } else {
                    await clearChat();
                    updatePinnedProduct(null); // Clear pinned product from previous session
                }

                await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
                const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                setLocalTracks([microphoneTrack, cameraTrack]);
                await client.publish([microphoneTrack, cameraTrack]);
                updateStreamStatus(true);
            } else {
                await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
                client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
                    await client.subscribe(user, mediaType);
                    if (mediaType === "video") {
                        setIsLive(true);
                        if (remoteVideoRef.current) {
                            user.videoTrack?.play(remoteVideoRef.current);
                        }
                    }
                    if (mediaType === "audio") {
                        user.audioTrack?.play();
                    }
                });

                client.on("user-unpublished", (user, mediaType) => {
                    if (mediaType === "video") {
                        setIsLive(false);
                    }
                });
            }

            setRole(selectedRole);
            setJoined(true);
        } catch (error) {
            console.error("Failed to join:", error);
            alert("Failed to join channel. See console for details.");
        }
    };

    const leaveChannel = async () => {
        if (role === 'host') {
            updateStreamStatus(false);
        }
        if (localTracks) {
            localTracks[0].close();
            localTracks[1].close();
            setLocalTracks(null);
        }
        await client.leave();
        setJoined(false);
        setRole(null);

        // Xóa view khi rời phòng
        if (currentViewerId.current) {
            removeViewer(currentViewerId.current);
            currentViewerId.current = null;
        }
    };

    const [isCamOn, setIsCamOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const toggleCam = async () => {
        if (localTracks && localTracks[1]) {
            await localTracks[1].setEnabled(!isCamOn);
            setIsCamOn(!isCamOn);
        }
    };

    const toggleMic = async () => {
        if (localTracks && localTracks[0]) {
            await localTracks[0].setEnabled(!isMicOn);
            setIsMicOn(!isMicOn);
        }
    };

    const handlePinProduct = (productId: number) => {
        const newId = productId === pinnedProductId ? null : productId;
        setPinnedProductId(newId);
        updatePinnedProduct(newId);
    };

    const handleAddToCart = async (product: Product) => {
        await addToCart(product.id, buyQuantity);
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    const handleBuyNow = async (product: Product) => {
        await addToCart(product.id, buyQuantity);
        const itemTotal = product.price * buyQuantity;
        const shippingCost = itemTotal > 3000000 ? 0 : 100000;
        const checkoutItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: buyQuantity
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
    };

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = commentInput.trim();
        if (!content) return;

        // --- BƯỚC 1: CHẶN SPAM (RATE LIMIT) ---
        const now = Date.now();
        if (now - lastChatTime.current < 2000) {
            alert("⏳ Bạn chat quá nhanh! Vui lòng đợi 2 giây.");
            return;
        }
        lastChatTime.current = now;

        let userName = 'Khách';
        if (role === 'host') {
            userName = 'Host';
        } else if (user && user.name) {
            userName = user.name;
        }

        // --- UI FEEDBACK ---
        const btn = document.querySelector('.send-btn') as HTMLButtonElement;
        const originalContent = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span style="font-size: 20px">...</span>';
        }

        // --- BƯỚC 2: CHECK TOXIC (AI) ---
        const isToxic = await checkToxicContent(content);

        // Restore button
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalContent;
        }

        if (isToxic) {
            alert("⚠️ Tin nhắn bị chặn vì vi phạm tiêu chuẩn cộng đồng!");
            return;
        }

        // --- BƯỚC 3: GỬI LÊN FIREBASE ---
        sendComment(userName, content);
        setCommentInput("");
    };

    const pinnedProduct = PRODUCTS.find(p => p.id === pinnedProductId);

    if (!joined) {
        return (
            <div className="join-wrapper">
                <h1>Live Stream Shopping</h1>
                <p>Xin chào, {user?.name || 'Khách'}</p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    {user?.role === 'live' ? (
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

                {isLive && user?.role === 'live' && (
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
                <div className="video-player">
                    {/* --- HIỂN THỊ MẮT XEM --- */}
                    {isLive && (
                        <div className="live-status-badge">
                            <span className="pulsing-dot"></span>
                            LIVE
                            <div className="viewer-count-separator">|</div>
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginBottom: -2, marginRight: 4 }}
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            {viewerCount}
                        </div>
                    )}

                    {role === 'host' && <div ref={hostVideoRef} className="host-player" />}
                    {role === 'audience' && <div ref={remoteVideoRef} className="remote-player" />}
                    {role === 'audience' && (!isLive || !remoteVideoRef.current) && (
                        <div className="offline-placeholder">
                            <h2>{isLive ? "Loading Stream..." : "Host is offline"}</h2>
                            {!isLive && <p>Please wait for the host to start the stream.</p>}
                        </div>
                    )}
                </div>

                {/* Video Overlays */}
                <div className="video-overlays">
                    {/* Popup Voucher - Only for Audience */}
                    {activeVoucher && role === 'audience' && (
                        <div className="flash-voucher-overlay">
                            <div className="voucher-content">
                                <div className="voucher-title">⚡ FLASH SALE ⚡</div>
                                <div className="voucher-code">{activeVoucher.code}</div>
                                <div className="voucher-desc">{activeVoucher.description}</div>

                                {role === 'audience' ? (
                                    <button onClick={() => {
                                        navigator.clipboard.writeText(activeVoucher.code);

                                        // Lưu voucher đã mở khóa vào ví
                                        const existingWallet = localStorage.getItem('my_vouchers');
                                        const wallet = existingWallet ? JSON.parse(existingWallet) : [];
                                        const exists = wallet.find((v: any) => v.code === activeVoucher.code);

                                        if (!exists) {
                                            wallet.push(activeVoucher);
                                            localStorage.setItem('my_vouchers', JSON.stringify(wallet));
                                        }

                                        alert("Đã copy mã! Hãy dán ở bước thanh toán.");
                                    }}>
                                        Sao chép mã ngay
                                    </button>
                                ) : (
                                    <p>Đang hiển thị cho khách...</p>
                                )}

                                <button className="close-btn" onClick={() => setActiveVoucher(null)}>×</button>
                            </div>
                        </div>
                    )}

                    {/* HOST: Admin Panel (Always Visible or Toggleable - Keeping as is for Host) */}
                    {role === 'host' && (
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
                                                            updateFlashVoucher(null);
                                                        } else {
                                                            const unlockedVoucher = { ...v, startDate: new Date().toISOString() };
                                                            updateFlashVoucher(unlockedVoucher);
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
                    )}

                    {/* AUDIENCE: Shopping Bag Icon & Drawer */}
                    {role === 'audience' && (
                        <>
                            {/* Floating Bag Icon */}
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

                            {/* Product Drawer */}
                            <div className={`product-drawer ${isDrawerOpen ? 'open' : ''}`}>
                                <div className="drawer-header">
                                    <h3>Danh sách sản phẩm</h3>
                                    <button className="close-drawer-btn" onClick={() => setIsDrawerOpen(false)}>×</button>
                                </div>

                                <div className="drawer-content">
                                    {PRODUCTS.map(product => (
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
                                                            addToCart(product.id, qty);
                                                            alert(`Đã thêm ${qty} ${product.name} vào giỏ!`);
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
                                                            addToCart(product.id, qty);
                                                            const shippingCost = product.price * qty > 3000000 ? 0 : 100000;
                                                            const checkoutItem = { id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty };
                                                            navigate('/thanh-toan', { state: { selectedItems: [checkoutItem], subtotal: product.price * qty, shipping: shippingCost, discount: 0, voucher: null, total: (product.price * qty) + shippingCost } });
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
                                </div>
                            </div>

                            {/* Backdrop */}
                            {isDrawerOpen && <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)} />}
                        </>
                    )}

                    {/* Pinned Product Card */}
                    {pinnedProduct && (
                        <div className="pinned-product-card">
                            <img src={pinnedProduct.image} alt={pinnedProduct.name} className="pinned-image" />
                            <div className="pinned-details">
                                <h3>{pinnedProduct.name}</h3>
                                <div className="pinned-price">{pinnedProduct.price.toLocaleString()}đ</div>
                                <div className="quantity-selector">
                                    <button onClick={() => setBuyQuantity(q => Math.max(1, q - 1))}>-</button>
                                    <span>{buyQuantity}</span>
                                    <button onClick={() => setBuyQuantity(q => q + 1)}>+</button>
                                </div>
                                <div className="action-buttons">
                                    <button className="add-cart-btn" onClick={() => handleAddToCart(pinnedProduct)}>Thêm</button>
                                    <button className="buy-now-btn" onClick={() => handleBuyNow(pinnedProduct)}>Mua</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Control Buttons */}
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
                </div>
            </div>

            {/* RIGHT: Chat Sidebar */}
            <div className="chat-sidebar">
                <div className="chat-header">
                    <h4>💬 Trò chuyện trực tiếp</h4>

                </div>

                <div className="chat-messages">
                    {comments.map((msg, idx) => (
                        <div key={idx} className="chat-message">
                            <div className="message-avatar">{msg.userName.charAt(0)}</div>
                            <div className="message-content">
                                <span className="message-user">{msg.userName}</span>
                                <span className="message-text">{msg.text}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <form className="chat-form" onSubmit={handleSendComment}>
                        <input
                            type="text"
                            placeholder="Nhập bình luận..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="chat-input"
                        />
                        <button type="submit" className="send-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LiveStreamPage;
