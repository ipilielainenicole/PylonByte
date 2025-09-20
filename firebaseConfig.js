// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAniSi_T_QVpWbGcHqdEzfZTELdyMcs6TI",
  authDomain: "pylonbyte.firebaseapp.com",
  projectId: "pylonbyte",
  storageBucket: "pylonbyte.firebasestorage.app", // ✅ double-check this (should usually be "pylonbyte.appspot.com")
  messagingSenderId: "723558974988",
  appId: "1:723558974988:web:7731e83ee44d1f8ffd1029"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth with persistence (fixes the warning you had)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// ✅ Firestore
export const db = getFirestore(app);
