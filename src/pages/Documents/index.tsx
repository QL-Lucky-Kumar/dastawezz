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
import shareIcon from "../../assets/share.png";
import CustomInput from "../../components/CustomInput";

const Documents = () => {
  const navigate = useNavigate();
  const [localDocList, setLocalDocList] = useState<any>();
  const [editorDocId, setEditorDocId] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [docFile, setDocfile] = useState<string>("");
  const [showEditorId, setShowEditorId] = useState<string>("");
  const [showNewDocEditor, setShowNewDocEditor] = useState<boolean>(false);
  const [shareDocs, setShareDocs] = useState<boolean>(false);

  const handleClickShareDocs = () => {
    setShareDocs(true);
  };

  const handleClickEdit = (item: any) => {
    const matchId = localDocList.find((data: any) => {
      return data.id === item.id;
    });
    setShowEditorId(item.id);
    setDocfile(matchId.docFile);
  };

  const handleOpenDocEditor = () => {
    setShowNewDocEditor(true);
    setShowEditorId("");
  };

  const handleCancelDelete = () => {
    setShowEditModal(false);
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

  const handleAddUpdateContent = async () => {
    if (showEditorId) {
      try {
        const docRef = doc(db, "localDocs", showEditorId);
        await updateDoc(docRef, {
          docFile: docFile,
        });
        navigate("/documents-list");
        setShowEditorId("");
        getLocalDocData();
        setShowNewDocEditor(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        let docInst = collection(db, "localDocs");
        await addDoc(docInst, { docFile });
        setShowNewDocEditor(false);
        getLocalDocData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getLocalDocData();
  }, []);

  return (
    <>
      {showNewDocEditor || showEditorId ? (
        <MyEditor
          docFile={docFile}
          value={docFile}
          onChange={setDocfile}
          handleBackBtn={handleAddUpdateContent}
        />
      ) : (
        <div className={style.wrapperAllBox}>
          <div className={style.mainDocumentListingBox}>
            <div className={style.otherTextBtnBox}>
              <h3 style={{ marginBottom: "0.5rem" }}>
                Created By Our Platform
              </h3>
            </div>

            <div className={style.documentsCardListing}>
              <button className={style.addNewDoc} onClick={handleOpenDocEditor}>
                <img src={plus} alt="plus-icon" width={24} />
                <br />
                Add New
                <br />
                Document
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
          </div>

          {showEditModal ? (
            <CustomModal
              closeModal={showEditModal}
              setCloseModal={setShowEditModal}
              title="Are you sure ! You want to delete this item."
              iconImg={deleteIcon}
            >
              <div className={style.deleteBtnBox}>
                <CustomBtn
                  btnName="Yes"
                  onClick={handleClickDeleteEditorDoc}
                  style={{ width: "100%" }}
                />
                <CustomBtn
                  btnName="Cancel"
                  onClick={handleCancelDelete}
                  style={{ width: "100%" }}
                />
              </div>
            </CustomModal>
          ) : null}

          {shareDocs ? (
            <CustomModal
              closeModal={shareDocs}
              setCloseModal={setShareDocs}
              title="Share your documents"
              iconImg={shareIcon}
            >
              <div className={style.shareBox}>
                <div className={style.userList}>
                  <CustomInput type="checkbox" />
                  <span>hello world</span>
                </div>
              </div>
              <div className={style.deleteBtnBox}>
                <CustomBtn
                  btnName="Share"
                  onClick={handleClickDeleteEditorDoc}
                  style={{ width: "100%" }}
                />
                <CustomBtn
                  btnName="Cancel"
                  onClick={handleCancelDelete}
                  style={{ width: "100%" }}
                />
              </div>
            </CustomModal>
          ) : null}

        </div>
      )}
    </>
  );
};

export default Documents;
