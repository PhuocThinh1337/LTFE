import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, onDisconnect } from "firebase/database";

// TODO: Replace with your actual Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2bzgTuFjaVlqPu8UHlCFawVUTfgqc7O8",
    authDomain: "thinh-81d27.firebaseapp.com",
    databaseURL: "https://thinh-81d27-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "thinh-81d27",
    storageBucket: "thinh-81d27.firebasestorage.app",
    messagingSenderId: "1049920559678",
    appId: "1:1049920559678:web:a5ae5f6a95fb82949f4f6f",
    measurementId: "G-96HLQKCDC1"
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
