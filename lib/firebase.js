// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx81vO8jIeTDUnFJIfDDVnn9y93IqquK8",
  authDomain: "checkmyentry-9044f.firebaseapp.com",
  projectId: "checkmyentry-9044f",
  storageBucket: "checkmyentry-9044f.firebasestorage.app",
  messagingSenderId: "576704423244",
  appId: "1:576704423244:web:3aad395cb1db558d5cdbe9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 IMPORTANT
export const db = getFirestore(app);
export const auth = getAuth(app);