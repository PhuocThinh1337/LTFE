import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, DataSnapshot, push, query, limitToLast, remove, get } from "firebase/database";

// TODO: Replace with your actual Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = firebaseConfig.databaseURL ? getDatabase(app) : null;

// --- PINNED PRODUCT LOGIC ---
export const updatePinnedProduct = (productId: number | null) => {
    if (db) {
        set(ref(db, 'live/pinnedProductId'), productId);
    }
};

export const subscribeToPinnedProduct = (callback: (productId: number | null) => void) => {
    if (!db) {
        const handleLocalUpdate = () => {
            const val = localStorage.getItem('live_pinnedProductId');
            callback(val ? parseInt(val) : null);
        };
        window.addEventListener('storage', handleLocalUpdate);
        handleLocalUpdate();
        return () => window.removeEventListener('storage', handleLocalUpdate);
    }

    const productRef = ref(db, 'live/pinnedProductId');
    return onValue(productRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

// --- STREAM STATUS LOGIC ---
export const updateStreamStatus = (isLive: boolean) => {
    if (db) {
        set(ref(db, 'live/isLive'), isLive);
    }
};

export const subscribeToStreamStatus = (callback: (isLive: boolean) => void) => {
    if (!db) {
        const handleLocalUpdate = () => {
            const val = localStorage.getItem('live_isLive');
            callback(val === 'true');
        };
        window.addEventListener('storage', handleLocalUpdate);
        handleLocalUpdate();
        return () => window.removeEventListener('storage', handleLocalUpdate);
    }

    const statusRef = ref(db, 'live/isLive');
    return onValue(statusRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        callback(data || false);
    });
};

export const getStreamStatus = async (): Promise<boolean> => {
    if (!db) {
        return localStorage.getItem('live_isLive') === 'true';
    }
    const statusRef = ref(db, 'live/isLive');
    const snapshot = await get(statusRef);
    return snapshot.val() || false;
};

// --- FLASH VOUCHER LOGIC ---
export const updateFlashVoucher = (voucher: any) => {
    if (db) {
        // set(ref(db, 'live/flashVoucher'), voucher);
    }
};

export const subscribeToFlashVoucher = (callback: (voucher: any) => void) => {
    if (!db) {
        const handleLocalUpdate = () => {
            const val = localStorage.getItem('live_flashVoucher');
            callback(val ? JSON.parse(val) : null);
        };
        const handleCustomUpdate = (e: any) => {
            callback(e.detail);
        };

        window.addEventListener('storage', handleLocalUpdate);
        window.addEventListener('live_flash_voucher_update', handleCustomUpdate);

        return () => {
            window.removeEventListener('storage', handleLocalUpdate);
            window.removeEventListener('live_flash_voucher_update', handleCustomUpdate);
        };
    }

    const voucherRef = ref(db, 'live/flashVoucher');
    return onValue(voucherRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        callback(data);
    });

};

// --- CHAT LOGIC ---
// Global in-memory chat storage (resets on page refresh - perfect for live sessions!)
let inMemoryComments: any[] = [];

// Clear all chat messages (both in-memory and Firebase)
export const clearChat = async () => {
    // Clear in-memory storage
    inMemoryComments = [];
    window.dispatchEvent(new CustomEvent('live_chat_update', { detail: [] }));

    // Clear Firebase database
    if (db) {
        try {
            const chatRef = ref(db, 'live/comments');
            await remove(chatRef);
        } catch (error) {
            console.error("❌ Lỗi khi xóa chat:", error);
        }
    }
};

export const sendComment = (userName: string, text: string) => {
    const comment = { userName, text, timestamp: Date.now() };

    // Also send to Firebase if available
    if (db) {
        push(ref(db, 'live/comments'), comment);
        return; // Early return to avoid local state update in DB mode
    }

    // Store ONLY in memory (NOT localStorage - this prevents old messages)
    inMemoryComments.push(comment);

    // Keep only last 50 messages
    if (inMemoryComments.length > 50) {
        inMemoryComments = inMemoryComments.slice(-50);
    }

    // Broadcast to all listeners in the same session
    window.dispatchEvent(new CustomEvent('live_chat_update', { detail: [...inMemoryComments] }));
};

export const subscribeToComments = (callback: (comments: any[]) => void) => {
    if (!db) {
        // Listen for new chat updates
        const handleCustomUpdate = (e: any) => {
            callback(e.detail);
        };

        window.addEventListener('live_chat_update', handleCustomUpdate);

        // Start with current in-memory comments (will be empty on fresh load)
        callback([...inMemoryComments]);

        return () => {
            window.removeEventListener('live_chat_update', handleCustomUpdate);
        };
    }

    // Firebase mode
    const chatRef = ref(db, 'live/comments');
    const q = query(chatRef, limitToLast(50));
    const unsubscribe = onValue(q, (snapshot) => {
        const data = snapshot.val();
        const list = data ? Object.values(data) : [];
        list.sort((a: any, b: any) => a.timestamp - b.timestamp);
        callback(list);
    });

    return unsubscribe;
};

// --- VOUCHER LOGIC ---
export const updateVoucher = (voucher: any) => {
    localStorage.setItem('live_active_voucher', JSON.stringify(voucher));
    window.dispatchEvent(new CustomEvent('live_voucher_update', { detail: voucher }));

    if (db) {
        set(ref(db, 'live/active_voucher'), voucher);
    }
};

export const subscribeToVoucher = (callback: (voucher: any) => void) => {
    if (!db) {
        const handleLocalUpdate = () => {
            const val = localStorage.getItem('live_active_voucher');
            callback(val ? JSON.parse(val) : null);
        };
        const handleCustomUpdate = (e: any) => {
            callback(e.detail);
        };
        window.addEventListener('storage', handleLocalUpdate);
        window.addEventListener('live_voucher_update', handleCustomUpdate);

        handleLocalUpdate();

        return () => {
            window.removeEventListener('storage', handleLocalUpdate);
            window.removeEventListener('live_voucher_update', handleCustomUpdate);
        };
    }

    const vRef = ref(db, 'live/active_voucher');
    const unsubscribe = onValue(vRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });

    return unsubscribe;
};
