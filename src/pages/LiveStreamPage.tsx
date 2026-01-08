import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { PRODUCTS, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { updatePinnedProduct, subscribeToPinnedProduct, updateStreamStatus, subscribeToStreamStatus, sendComment, subscribeToComments, clearChat } from '../services/firebase';
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

        // Subscribe to comments AFTER clearing
        const unsubscribeComments = subscribeToComments((newComments) => {
            setComments(newComments);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });

        return () => {
            unsubscribeProduct();
            unsubscribeStatus();
            unsubscribeComments();
            // Don't call leaveChannel here to avoid dependency warning
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const joinChannel = async (selectedRole: 'host' | 'audience') => {
        try {
            // Clear chat when joining a new session
            localStorage.removeItem('live_comments');
            setComments([]);

            if (selectedRole === 'host') {
                if (user?.role !== 'live') {
                    alert("Bạn không có quyền Host!");
                    return;
                }
                // QUAN TRỌNG: Xóa chat cũ trên Firebase Server khi Host bắt đầu live
                await clearChat();
                updatePinnedProduct(null); // Clear pinned product from previous session

                await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
                const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                setLocalTracks([microphoneTrack, cameraTrack]);
                await client.publish([microphoneTrack, cameraTrack]);
                console.log("Host joined and published");
                updateStreamStatus(true);
            } else {
                await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
                client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
                    await client.subscribe(user, mediaType);
                    console.log("subscribed to user", user.uid);
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

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim()) return;
        const userName = role === 'host' ? 'Host' : `User ${Math.floor(Math.random() * 1000)}`;
        sendComment(userName, commentInput.trim());
        setCommentInput("");
    };

    const pinnedProduct = PRODUCTS.find(p => p.id === pinnedProductId);

    if (!joined) {
        return (
            <div className="join-wrapper">
                <h1>Live Stream Shopping</h1>

                <div style={{ display: 'flex', gap: '20px' }}>
                    {user?.role === 'live' && (
                        <button className="btn-primary" onClick={() => joinChannel('host')}>Start Live (Host)</button>
                    )}
                    <button className="btn-secondary" onClick={() => joinChannel('audience')}>Watch Live (Audience)</button>
                </div>
            </div>
        );
    }

    return (
        <div className="live-stream-container">
            {/* LEFT: Video Area */}
            <div className="video-section">
                <div className="video-player">
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
                    {/* Host Product List */}
                    {role === 'host' && (
                        <div className="host-product-list">
                            <h3>Admin Products</h3>
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
