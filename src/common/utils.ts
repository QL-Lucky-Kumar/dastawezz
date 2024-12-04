import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { DB_COLLECTION } from "./common.types";

export const getDocById = async <T>(
  collectionName: DB_COLLECTION,
  docId: string
): Promise<T> => {
  if (!docId) throw new Error("Could not get the Doc ID");
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return docSnap.data() as T;
    } else {
      throw new Error("Doc does not exists");
    }
  } catch (error) {
    throw new Error(
      `Failed to fetch document: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const updateDocById = async <T extends { [key: string]: unknown }>(
  collectionName: DB_COLLECTION,
  docId: string,
  payload: T
): Promise<void> => {
  if (!docId) throw new Error("Could not get the Doc ID");
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, payload);
  } catch (error) {
    throw new Error(
      `Failed to Update the document: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const addNewDoc = async <T extends { [key: string]: unknown }>(
  collectionName: DB_COLLECTION,
  payload: T
): Promise<DocumentReference<DocumentData>> => {
  try {
    const collectionRef = collection(db, collectionName);
    return await addDoc(collectionRef, payload);
  } catch (error) {
    throw new Error(
      `Failed to add the document: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteDocById = async (
    collectionName: DB_COLLECTION,
    docId: string
  ): Promise<void> => {
    if (!docId) throw new Error("Could not get the Doc ID");
    try {
      const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
      } catch (error) {
      throw new Error(
        `Failed to delete the document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };