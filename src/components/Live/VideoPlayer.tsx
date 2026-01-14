import React from 'react';

interface VideoPlayerProps {
    role: 'host' | 'audience' | null;
    isLive: boolean;
    viewerCount: number;
    hostVideoRef: React.RefObject<HTMLDivElement | null>;
    remoteVideoRef: React.RefObject<HTMLDivElement | null>;
    children?: React.ReactNode; // For overlays
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    role,
    isLive,
    viewerCount,
    hostVideoRef,
    remoteVideoRef,
    children
}) => {
    return (
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

            {/* Overlays */}
            <div className="video-overlays">
                {children}
            </div>
        </div>
    );
};

export default VideoPlayer;
