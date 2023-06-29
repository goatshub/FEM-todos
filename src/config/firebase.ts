// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBunhfW95NFzNFwk7zUv2fstFfdNJ6vz7A",
  authDomain: "fem-todo.firebaseapp.com",
  projectId: "fem-todo",
  storageBucket: "fem-todo.appspot.com",
  messagingSenderId: "285053335288",
  appId: "1:285053335288:web:f868138eb1cee13b326d0d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const ggProvider = new GoogleAuthProvider();
