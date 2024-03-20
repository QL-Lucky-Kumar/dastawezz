import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpMiqcPIM6g3U9pwLt7HCbSVJuUC2UqPw",
  authDomain: "gyanganga-b97fd.firebaseapp.com",
  projectId: "gyanganga-b97fd",
  storageBucket: "gyanganga-b97fd.appspot.com",
  messagingSenderId: "554825264448",
  appId: "1:554825264448:web:060070757df612f80d5ea5",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const fileDB = getStorage(app);
export const userRef = collection(db, "users");
