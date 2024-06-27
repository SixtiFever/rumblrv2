// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXiUiALBzA74X7k8VmwuHzit2dBxaKwB0",
  authDomain: "prac2-6f44e.firebaseapp.com",
  projectId: "prac2-6f44e",
  storageBucket: "prac2-6f44e.appspot.com",
  messagingSenderId: "1062140723267",
  appId: "1:1062140723267:web:2e2b05998d10df7a30d4f6"
};

// Initialize Firebase
export const APP = initializeApp(firebaseConfig);
export const AUTH = getAuth(APP);
export const FIRESTORE = getFirestore(APP);