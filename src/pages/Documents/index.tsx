import { useNavigate } from "react-router-dom";
import DocumentCard from "./DocumentCard";
import style from "./documents.module.css";
import plus from "../../assets/plus.png";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import dummyPic from "../../assets/dummyPic.png";
import CustomModal from "../../components/CustomModal";
import CustomBtn from "../../components/CustomBtn";
import { deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import deleteIcon from "../../assets/delete_.png";
import MyEditor from "../DocEditor";

const Documents = () => {
  const navigate = useNavigate();
  const [docList, setDocList] = useState<any>();
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [docId, setDocId] = useState<string>("");
  const [localDocList, setLocalDocList] = useState<any>();
  const [editorDocId, setEditorDocId] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [docFile, setDocfile] = useState<string>("");
  const [showEditor, setShowEditor] = useState<boolean>(false);

  const handleClickShareDocs = () => {
    alert("hello share");
  };

  const handleClickEdit = (item: any) => {
    const matchId = localDocList.find((data: any) => {
      return data.id === item.id;
    });
    setShowEditor(true);
    setDocfile(matchId.docFile);
  };

  const handleClickEditDocs = async (id: string) => {
    // navigate("/edit-docs");
    try {
      const docRef = doc(db, "localDocs", id);
      await updateDoc(docRef, {
        // docFile: newValue,
      });
      navigate("/documents-list");
      toast.success("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleShowDeleteModal = (id: string) => {
    setCloseModal(true);
    setDocId(id);
  };

  const handleOpenDocEditor = () => {
    navigate("/edit-docs");
  };

  const handleClickDeleteDocs = async () => {
    try {
      await deleteDoc(doc(db, "document", docId));
      getDocumentDataList();
      setCloseModal(false);
      toast.success("Delete Successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleCancelDelete = () => {
    setCloseModal(false);
    setShowEditModal(false);
  };

  const getDocumentDataList = async () => {
    try {
      const getDataList = collection(db, "document");
      const response = await getDocs(getDataList);
      const result = response.docs.map((val) => ({
        ...val.data(),
        id: val.id,
      }));
      setDocList(result);
    } catch (error) {
      console.error("Error occurred while fetching document data:", error);
    }
  };

  const handleDeleteEditorDoc = (id: string) => {
    setShowEditModal(true);
    setEditorDocId(id);
  };

  const getLocalDocData = async () => {
    try {
      const getLocalList = collection(db, "localDocs");
      const resp = await getDocs(getLocalList);
      const result = resp.docs.map((val) => ({
        ...val.data(),
        id: val.id,
      }));
      setLocalDocList(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDeleteEditorDoc = async () => {
    try {
      await deleteDoc(doc(db, "localDocs", editorDocId));
      getLocalDocData();
      setShowEditModal(false);
      toast.success("Delete Successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleGetContent = async () => {
    try {
      let docInst = collection(db, "localDocs");
      await addDoc(docInst, { docFile });
      navigate("/documents-list");
      toast.success("Added Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDocumentDataList();
    getLocalDocData();
  }, []);

  return (
    <>
      {showEditor ? (
        <MyEditor
          docFile={docFile}
          value={docFile}
          onChange={setDocfile}
          onClick={handleGetContent}
        />
      ) : (
        <>
          <div className={style.documentsCardListing}>
            <button className={style.addNewDoc} onClick={handleOpenDocEditor}>
              <img src={plus} alt="plus-icon" width={24} />
              <br />
              Add New Document
            </button>
            {localDocList?.map((item: any) => {
              return (
                <DocumentCard
                  docImage={dummyPic}
                  key={item.id}
                  handleEditDocuments={() => handleClickEdit(item)}
                  handleShareDocuments={handleClickShareDocs}
                  handleDeleteDocuments={() => handleDeleteEditorDoc(item.id)}
                />
              );
            })}
          </div>

          <div className={style.otherDocumentsList}>
            <h3>Created By Other Platform</h3>
            <div className={style.otherDocList}>
              {docList?.map((item: any) => {
                return (
                  <DocumentCard
                    docImage={item.docFile ? item.docFile : dummyPic}
                    key={item.id}
                    handleEditDocuments={handleClickEditDocs}
                    handleShareDocuments={handleClickShareDocs}
                    handleDeleteDocuments={() => handleShowDeleteModal(item.id)}
                    title={
                      item?.docTitle?.length > 20
                        ? item.docTitle.slice(0, 20) + "..."
                        : item.docTitle
                    }
                  />
                );
              })}
            </div>
          </div>

          {closeModal ? (
            <CustomModal
              closeModal={closeModal}
              setCloseModal={setShowEditModal}
              title="Are you sure ! You want to delete this item."
              iconImg={deleteIcon}
            >
              <div className={style.deleteBtnBox}>
                <CustomBtn btnName="Yes" onClick={handleClickDeleteDocs} />
                <CustomBtn btnName="Cancel" onClick={handleCancelDelete} />
              </div>
            </CustomModal>
          ) : null}

          {showEditModal ? (
            <CustomModal
              closeModal={showEditModal}
              setCloseModal={setCloseModal}
              title="Are you sure ! You want to delete this item."
              iconImg={deleteIcon}
            >
              <div className={style.deleteBtnBox}>
                <CustomBtn btnName="Yes" onClick={handleClickDeleteEditorDoc} />
                <CustomBtn btnName="Cancel" onClick={handleCancelDelete} />
              </div>
            </CustomModal>
          ) : null}
        </>
      )}
    </>
  );
};

export default Documents;
