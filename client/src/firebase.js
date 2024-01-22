// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c28e6.firebaseapp.com",
  projectId: "mern-estate-c28e6",
  storageBucket: "mern-estate-c28e6.appspot.com",
  messagingSenderId: "1049089956789",
  appId: "1:1049089956789:web:ee5799005346b39f2217fc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
