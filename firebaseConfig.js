// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAniSi_T_QVpWbGcHqdEzfZTELdyMcs6TI",
  authDomain: "pylonbyte.firebaseapp.com",
  projectId: "pylonbyte",
  storageBucket: "pylonbyte.appspot.com",
  messagingSenderId: "723558974988",
  appId: "1:723558974988:web:7731e83ee44d1f8ffd1029",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth for React Native and Web
let auth;

// For React Native (Expo)
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Fallback for web
  auth = getAuth(app);
}

// ✅ Firestore
const db = getFirestore(app);

export { auth, db };
