// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx81vO8jIeTDUnFJIfDDVnn9y93IqquK8",
  authDomain: "checkmyentry-9044f.firebaseapp.com",
  projectId: "checkmyentry-9044f",
  storageBucket: "checkmyentry-9044f.firebasestorage.app",
  messagingSenderId: "576704423244",
  appId: "1:576704423244:web:3aad395cb1db558d5cdbe9",
  measurementId: "G-B8NMN2LS9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 IMPORTANT
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}