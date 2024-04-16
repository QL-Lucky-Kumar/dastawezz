import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: "dastawezz-757ce.firebaseapp.com",
  projectId: "dastawezz-757ce",
  storageBucket: "dastawezz-757ce.appspot.com",
  messagingSenderId: "231378213467",
  appId: "1:231378213467:web:f638850f115033611f3d7e",
  measurementId: "G-QFFZ3M9E32",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const fileDB = getStorage(app);
export const userRef = collection(db, "users");
