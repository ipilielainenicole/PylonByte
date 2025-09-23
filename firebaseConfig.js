// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  browserLocalPersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAniSi_T_QVpWbGcHqdEzfZTELdyMcs6TI",
  authDomain: "pylonbyte.firebaseapp.com",
  projectId: "pylonbyte",
  storageBucket: "pylonbyte.appspot.com", // fixed bucket
  messagingSenderId: "723558974988",
  appId: "1:723558974988:web:7731e83ee44d1f8ffd1029",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;

// ✅ Web (localhost or Expo web build)
if (typeof window !== "undefined") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  // ✅ Mobile (Expo Go or native app)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// ✅ Firestore
const db = getFirestore(app);

export { auth, db };
