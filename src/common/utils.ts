import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DB_COLLECTION } from "./common.types";

export const getDocById = async (docId:string) => {
    if(!docId) return 
    try {
        const docSnap = await getDoc(doc(db, DB_COLLECTION.localDocs, docId));
        if (docSnap.exists()) return docSnap.data();
        
      } catch (error) {
        alert(`Error fetching document: ${error}`);
      }
}