import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { PRODUCTS, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { updatePinnedProduct, subscribeToPinnedProduct, updateStreamStatus, subscribeToStreamStatus } from '../services/firebase';
import './LiveStreamPage.css';

// --- CONFIGURATION ---
// IMPORTANT: Replace with your actual App ID from Agora Console
const APP_ID = process.env.REACT_APP_AGORA_APP_ID || "";
const CHANNEL_NAME = "ecommerce_live";
const TOKEN = null; // Create an App ID only project for testing to avoid token generation

const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const LiveStreamPage: React.FC = () => {
    const [joined, setJoined] = useState(false);
    const [role, setRole] = useState<'host' | 'audience' | null>(null);
    const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const [pinnedProductId, setPinnedProductId] = useState<number | null>(null);
    const [isLive, setIsLive] = useState(false);

    const hostVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);

    // We need cart context later for "Buy Now"
    const { addToCart } = useCart();

    useEffect(() => {
        if (joined && role === 'host' && localTracks && hostVideoRef.current) {
            localTracks[1].play(hostVideoRef.current);
        }
    }, [joined, role, localTracks]);

    useEffect(() => {
        // Listen for pinned product changes
        const unsubscribeProduct = subscribeToPinnedProduct((productId) => {
            setPinnedProductId(productId);
        });

        // Listen for global stream status
        const unsubscribeStatus = subscribeToStreamStatus((status) => {
            setIsLive(status);

            // Auto-leave if you are audience and stream goes offline
            // if (!status && role === 'audience') { 
            // Optional: Force leave or show offline UI
            // }
        });

        // Cleanup on unmount
        return () => {
            unsubscribeProduct();
            unsubscribeStatus();
            leaveChannel();
        };
    }, []);

    const joinChannel = async (selectedRole: 'host' | 'audience') => {
        try {
            if (selectedRole === 'host') {
                // Host Setup
                await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);

                // Create tracks
                const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                setLocalTracks([microphoneTrack, cameraTrack]);

                // Publish tracks
                await client.publish([microphoneTrack, cameraTrack]);

                console.log("Host joined and published");

                // Tell everyone stream is LIVE
                updateStreamStatus(true);

            } else {
                // Audience Setup
                await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);

                // Event listener for remote users
                client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
                    await client.subscribe(user, mediaType);
                    console.log("subscribed to user", user.uid);

                    if (mediaType === "video") {
                        // Check if this is likely the host (simplification: assume first remote user is host)
                        if (remoteVideoRef.current) {
                            user.videoTrack?.play(remoteVideoRef.current);
                        }
                    }
                    if (mediaType === "audio") {
                        user.audioTrack?.play();
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
        // Note: We don't clear pinnedProductId here if we want to keep it persisted, but usually we should just stop listening/caring
    };

    const handlePinProduct = (productId: number) => {
        const newId = productId === pinnedProductId ? null : productId;
        // Update local state is handled by the subscription, but we can do optimistically too
        // setPinnedProductId(newId); 
        // Sync to Firebase
        updatePinnedProduct(newId);
    };

    const handleBuyNow = (product: Product) => {
        addToCart(product.id, 1);
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    const pinnedProduct = PRODUCTS.find(p => p.id === pinnedProductId);

    if (!joined) {
        return (
            <div className="join-wrapper">
                <h1>Live Stream Shopping</h1>
                <p>Chọn vai trò của bạn</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button className="btn-primary" onClick={() => joinChannel('host')}>Start Live (Host)</button>
                    <button className="btn-secondary" onClick={() => joinChannel('audience')}>Watch Live (Audience)</button>
                </div>
            </div>
        );
    }

    return (
        <div className="live-stream-container">
            <div className="video-grid">
                {/* Host View */}
                {role === 'host' && (
                    <div ref={hostVideoRef} className="host-player" />
                )}

                {/* Audience View */}
                {role === 'audience' && (
                    <div ref={remoteVideoRef} className="remote-player" />
                )}

                {/* Placeholder for no video */}
                {role === 'audience' && (!isLive || !remoteVideoRef.current) && (
                    <div style={{ color: 'white', position: 'absolute', textAlign: 'center' }}>
                        <h2>{isLive ? "Loading Stream..." : "Host is offline"}</h2>
                        {!isLive && <p>Please wait for the host to start the stream.</p>}
                    </div>
                )}

                {/* --- OVERLAY UI --- */}
                <div className="overlay-container">
                    {/* Host: Product List to Pin */}
                    {role === 'host' && (
                        <div className="host-product-list">
                            <h3 style={{ color: 'white', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Admin Products</h3>
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

                    {/* All: Pinned Product Card */}
                    {pinnedProduct && (
                        <div className="pinned-product-card">
                            <img src={pinnedProduct.image} alt={pinnedProduct.name} className="pinned-image" />
                            <div className="pinned-details">
                                <h3>{pinnedProduct.name}</h3>
                                <div className="pinned-price">{pinnedProduct.price.toLocaleString()}đ</div>
                                <button className="buy-now-btn" onClick={() => handleBuyNow(pinnedProduct)}>Mua ngay</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <div className="live-controls">
                <button className="btn-secondary" onClick={leaveChannel}>Leave Stream</button>
            </div>
        </div>
    );
};

export default LiveStreamPage;
