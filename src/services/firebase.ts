import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, onDisconnect } from "firebase/database";

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
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app, firebaseConfig.databaseURL);

export const updatePinnedProduct = (productId: number | null) => {
    set(ref(db, 'live/pinnedProductId'), productId);
};

export const subscribeToPinnedProduct = (callback: (productId: number | null) => void) => {
    const starCountRef = ref(db, 'live/pinnedProductId');
    // Return the unsubscribe function (handled by Firebase SDK mostly, but onValue returns Unsubscribe)
    return onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

export const updateStreamStatus = (isLive: boolean) => {
    const statusRef = ref(db, 'live/isLive');
    set(statusRef, isLive);

    if (isLive) {
        // If user goes offline/closes tab, automatically set isLive to false
        onDisconnect(statusRef).set(false);
    } else {
        onDisconnect(statusRef).cancel(); // Cancel if manually stopped
    }
};

export const subscribeToStreamStatus = (callback: (isLive: boolean) => void) => {
    const statusRef = ref(db, 'live/isLive');
    return onValue(statusRef, (snapshot) => {
        const data = snapshot.val();
        callback(!!data); // Convert to boolean
    });
};
