// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDxoeaqcER_yZWZVUTKjOdpoDP9YahN6V8",
  authDomain: "afritrade-ea986.firebaseapp.com",
  projectId: "afritrade-ea986",
  storageBucket: "afritrade-ea986.appspot.com",
  messagingSenderId: "456068070855",
  appId: "1:456068070855:web:45949efba14014b7a36de2",
  measurementId: "G-S9K9DM322R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);