// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "findmyhome-78d02.firebaseapp.com",
  projectId: "findmyhome-78d02",
  storageBucket: "findmyhome-78d02.firebasestorage.app",
  messagingSenderId: "318483550004",
  appId: "1:318483550004:web:b64bac767c9900f4a99f61"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);