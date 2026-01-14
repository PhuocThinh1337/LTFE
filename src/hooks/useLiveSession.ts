import { useState, useEffect, useRef } from 'react';
import { subscribeToPinnedProduct, subscribeToStreamStatus, subscribeToViewerCount, subscribeToFlashVoucher, trackViewer, removeViewer, updatePinnedProduct } from '../services/firebase';
import { Voucher } from '../data/vouchers';

interface UseLiveSessionProps {
    user: any;
    joined: boolean;
}

export const useLiveSession = ({ user, joined }: UseLiveSessionProps) => {
    const [pinnedProductId, setPinnedProductId] = useState<number | null>(null);
    const [isLive, setIsLive] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    const [activeVoucher, setActiveVoucher] = useState<Voucher | null>(null);
    const currentViewerId = useRef<string | null>(null);

    // Initial subscriptions
    useEffect(() => {
        const unsubscribeProduct = subscribeToPinnedProduct((productId) => {
            setPinnedProductId(productId);
        });

        const unsubscribeStatus = subscribeToStreamStatus((status) => {
            setIsLive(status);
        });

        const unsubscribeViewerCount = subscribeToViewerCount((count) => {
            setViewerCount(count);
        });

        const unsubscribeVoucher = subscribeToFlashVoucher((voucher) => {
            setActiveVoucher(voucher);
        });

        return () => {
            unsubscribeProduct();
            unsubscribeStatus();
            unsubscribeViewerCount();
            unsubscribeVoucher();
        };
    }, []);

    // Handle Viewer Tracking when joined
    useEffect(() => {
        if (joined) {
            const currentUid = user?.id ? `user_${user.id}` : `guest_${Math.floor(Math.random() * 100000)}`;
            const currentName = user?.name || 'Khách';
            currentViewerId.current = currentUid;
            trackViewer(currentUid, { name: currentName });
        } else {
            if (currentViewerId.current) {
                removeViewer(currentViewerId.current);
                currentViewerId.current = null;
            }
        }

        return () => {
            if (currentViewerId.current) {
                removeViewer(currentViewerId.current);
            }
        };
    }, [joined, user]);

    const handlePinProduct = (productId: number) => {
        const newId = productId === pinnedProductId ? null : productId;
        setPinnedProductId(newId);
        updatePinnedProduct(newId);
    };

    return {
        pinnedProductId,
        setPinnedProductId, // Needed so we can update it locally if needed, but mostly pushed from server
        isLive,
        setIsLive,
        viewerCount,
        activeVoucher,
        setActiveVoucher,
        handlePinProduct
    };
};
