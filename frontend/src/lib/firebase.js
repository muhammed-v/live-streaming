// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjqjCxZiLAZRTNFg6f8_pnI7dslpm4p44",
  authDomain: "nitc-stream.firebaseapp.com",
  projectId: "nitc-stream",
  storageBucket: "nitc-stream.firebasestorage.app",
  messagingSenderId: "757958234907",
  appId: "1:757958234907:web:5ecaf876cddbe3ac0039be",
  measurementId: "G-J4E8D4MKPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {
    db
}