import { useState, useRef, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { clearChat, updateStreamStatus, getStreamStatus, updatePinnedProduct } from '../services/firebase';

const APP_ID = process.env.REACT_APP_AGORA_APP_ID || "";
const CHANNEL_NAME = "ecommerce_live";
const TOKEN = null;

const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

interface UseAgoraProps {
    user: any;
    role: 'host' | 'audience' | null;
    setRole: (role: 'host' | 'audience' | null) => void;
    setIsLive: (isLive: boolean) => void;
    joined: boolean;
    setJoined: (joined: boolean) => void;
}

export const useAgora = ({ user, role, setRole, setIsLive, joined, setJoined }: UseAgoraProps) => {
    const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const [isCamOn, setIsCamOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const hostVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);
    const localTracksRef = useRef<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);

    // Sync ref for cleanup
    useEffect(() => {
        localTracksRef.current = localTracks;
    }, [localTracks]);

    useEffect(() => {
        if (joined && role === 'host' && localTracks && hostVideoRef.current) {
            localTracks[1].play(hostVideoRef.current);
        }
    }, [joined, role, localTracks]);

    useEffect(() => {
        return () => {
            // FIX: Cleanup tracks and connection on unmount
            if (localTracksRef.current) {
                localTracksRef.current[0].close();
                localTracksRef.current[1].close();
            }
            if (client.connectionState === 'CONNECTED' || client.connectionState === 'CONNECTING') {
                client.leave().catch(err => console.error("Unmount leave error:", err));
            }
        };
    }, []);

    const joinChannel = async (selectedRole: 'host' | 'audience') => {
        try {
            if (client.connectionState === 'CONNECTED' || client.connectionState === 'CONNECTING') {
                console.log("⚠️ Client đang trong trạng thái connected/connecting. Đang rời phòng cũ...");
                await client.leave();
            }

            if (selectedRole === 'host') {
                if (user?.role !== 'admin') {
                    alert("Bạn không có quyền Host!");
                    return;
                }

                const remoteIsLive = await getStreamStatus();
                if (remoteIsLive) {
                    const confirmReconnect = window.confirm(
                        "Đang có phiên Live diễn ra! Bạn muốn tiếp tục (Reconnect) hay Xóa cũ tạo mới?\nOK: Reconnect\nCancel: Hủy"
                    );

                    if (!confirmReconnect) return;

                    console.log("Host đang Reconnect...");
                } else {
                    await clearChat();
                    updatePinnedProduct(null);
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
    };

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

    return {
        localTracks,
        isCamOn,
        isMicOn,
        hostVideoRef,
        remoteVideoRef,
        joinChannel,
        leaveChannel,
        toggleCam,
        toggleMic
    };
};
