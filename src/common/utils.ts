import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AFFECTED_DOC_TYPE, DB_COLLECTION, LOCAL_DOCS_TYPE, OPERATION_TYPE } from "./common.types";


//----------------------Common Functions---------------------------------//
export const getDocById = async <T>(
  collectionName: DB_COLLECTION,
  docId: string
): Promise<T & QueryDocumentSnapshot<DocumentData, DocumentData>> => {
  if (!docId) throw new Error("Could not get the Doc ID");
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return docSnap.data() as T & QueryDocumentSnapshot<DocumentData, DocumentData>;
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

export const getAllDocs = async <T>(collectionName: DB_COLLECTION): Promise<T[]> => {
    try {
      const docsRef = collection(db, collectionName); 
      const querySnapshot = await getDocs(docsRef); 
      const docsData: T[] = [];
  
      querySnapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          docsData.push({
            ...docSnap.data(), 
            id: docSnap.id, 
          } as T);
        }
      });
  
      return docsData; 
    } catch (error) {
      throw new Error(
        `Failed to fetch documents from ${collectionName}: ${
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
  if(!Object.keys(payload).length) throw new Error("Need payload to add data") 
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

export const setDocById = async <T extends { [key: string]: unknown }>(
  collectionName: DB_COLLECTION,
  docId: string,
  payload: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, payload);
  } catch (error) {
    throw new Error(
      `Failed to set the document: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteDocById = async (
    collectionName: DB_COLLECTION,
    docId?: string
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

// Extracts plain text from the HTML
export const extractTextFromHTML = (htmlContent: string) => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.body.textContent || ""; 
};


//----------------------Component Specific Functions---------------------------------//

// Handling Document ID and its operations that are related to other documents as well : This will be edited with time if flows changes
export const handleDocOperations = async <T extends { [key: string]: unknown }>(affectedDocs:AFFECTED_DOC_TYPE[],targetDocOpType:OPERATION_TYPE,OpDocCollection:DB_COLLECTION,OpDocId?:string,targetDocPayload?:T) => {
  try {
    let newlyAddedDocId :string = ''
    switch (targetDocOpType) {
      case OPERATION_TYPE.delete:
        await deleteDocById(OpDocCollection, OpDocId);
        break;
      case OPERATION_TYPE.add:
        const newDoc = await addNewDoc<T>(OpDocCollection, targetDocPayload!);
        newlyAddedDocId = newDoc.id
        break;
      default:
        break;
    }
    for (const affectedDoc of affectedDocs) {
      if (affectedDoc.operationsType === OPERATION_TYPE.delete) {
        await updateDocById(affectedDoc.docCollection, affectedDoc.docId, {
          docs: arrayRemove(OpDocId),
        });
      } else if(affectedDoc.operationsType === OPERATION_TYPE.add){
        await updateDocById(affectedDoc.docCollection, affectedDoc.docId, {
          docs: arrayUnion(newlyAddedDocId),
        });
      }
    }
    return newlyAddedDocId
  } catch (error) {
    throw new Error(`Got Error performing operation for collection ${OpDocCollection}. Error: ${error}`)
  }
}

//Deletes and filtered Local Doc Data (Deletes on the basis of empty title and empty quill content)
export const getFilteredLocalDocData = async (userId?:string) => {
    try {
      const result = await getAllDocs<LOCAL_DOCS_TYPE>(DB_COLLECTION.localDocs)
      const docsToDelete = await Promise.all(
        result.map(async (doc) => {
          if (!doc.docTitle && !extractTextFromHTML(doc.htmlContent).trim()) {
            await deleteDocById(DB_COLLECTION.localDocs, doc.id!);
            return doc.id;
          }
          return null; 
        })
      );
 
      const filterDocList = result.filter(
        (doc) => !docsToDelete.includes(doc.id)
      );
  
      const docs =  userId ? filterDocList.filter((item) => item.createdBy === userId) : filterDocList;
  
      return docs
    } catch (error) {
      throw new Error("Unable to fetch Local Docs Data :" + error)
    }
  };