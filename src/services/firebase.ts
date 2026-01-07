import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, onDisconnect, DataSnapshot } from "firebase/database";

// TODO: Replace with your actual Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (Handle HMR to prevent "App already exists" error)
let app;
let db: any = null;

if (firebaseConfig.databaseURL) {
    try {
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        db = getDatabase(app, firebaseConfig.databaseURL);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
} else {
    console.warn("Firebase configuration missing (REACT_APP_FIREBASE_DATABASE_URL). Running in offline/mock mode.");
}

export const updatePinnedProduct = (productId: number | null): void => {
  // Mock: Store in localStorage
  localStorage.setItem('live_pinnedProductId', productId?.toString() || 'null');
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new CustomEvent('live_pinned_product_update', { detail: productId }));
  
  if (db) {
      // TODO: Implement Firebase write if db is available
      // set(ref(db, 'live/pinnedProductId'), productId);
  }
};

export const subscribeToPinnedProduct = (callback: (productId: number | null) => void) => {
    if (!db) {
        // Mock implementation
        const handleLocalUpdate = (e: any) => {
            const val = localStorage.getItem('live_pinnedProductId');
            callback(val === 'null' ? null : Number(val));
        };
        const handleCustomUpdate = (e: any) => {
            callback(e.detail);
        };
        
        window.addEventListener('storage', handleLocalUpdate);
        window.addEventListener('live_pinned_product_update', handleCustomUpdate);
        
        // Initial value
        const val = localStorage.getItem('live_pinnedProductId');
        callback(val === 'null' ? null : Number(val));

        return () => {
            window.removeEventListener('storage', handleLocalUpdate);
            window.removeEventListener('live_pinned_product_update', handleCustomUpdate);
        };
    }

    const starCountRef = ref(db, 'live/pinnedProductId');
    // Return the unsubscribe function
    return onValue(starCountRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

export const updateStreamStatus = (isLive: boolean): void => {
  // Mock: Store in localStorage
  localStorage.setItem('live_isLive', isLive.toString());
  window.dispatchEvent(new CustomEvent('live_stream_status_update', { detail: isLive }));
  
  if (db) {
      // set(ref(db, 'live/isLive'), isLive);
  }
};

export const subscribeToStreamStatus = (callback: (isLive: boolean) => void) => {
    if (!db) {
        // Mock implementation
        const handleLocalUpdate = () => {
             const val = localStorage.getItem('live_isLive');
             callback(val === 'true');
        };
        const handleCustomUpdate = (e: any) => {
            callback(e.detail);
        };

        window.addEventListener('storage', handleLocalUpdate);
        window.addEventListener('live_stream_status_update', handleCustomUpdate);

        // Initial check
        const val = localStorage.getItem('live_isLive');
        callback(val === 'true');

        return () => {
            window.removeEventListener('storage', handleLocalUpdate);
            window.removeEventListener('live_stream_status_update', handleCustomUpdate);
        };
    }

    const statusRef = ref(db, 'live/isLive');
    return onValue(statusRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        callback(!!data); // Convert to boolean
    });
};
