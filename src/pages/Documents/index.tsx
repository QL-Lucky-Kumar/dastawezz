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
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import deleteIcon from "../../assets/delete_.png"

const Documents = () => {
  const navigate = useNavigate();
  const [docList, setDocList] = useState<any>();
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [docId, setDocId] = useState<string>("");

  const handleClickShareDocs = () => {
    alert("hello share");
  };
  const handleClickEditDocs = () => {
    navigate("/edit-docs");
  };

  const handleShowDeleteModal = (id: string) => {
    setCloseModal(true);
    setDocId(id);
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
  };

  const handleOpenDocEditor = () => {
    navigate("/edit-docs");
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

  useEffect(() => {
    getDocumentDataList();
  }, []);

  return (
    <>
      <div className={style.documentsCardListing}>
        <button className={style.addNewDoc} onClick={handleOpenDocEditor}>
          <img src={plus} alt="plus-icon" width={24} />
          <br />
          Add New Document
        </button>
        {docList?.map((item: any) => {
          console.log();

          return (
            <DocumentCard
              docImage={item.docFile ? item.docFile : dummyPic}
              key={item.id}
              handleEditDocuments={handleClickEditDocs}
              handleShareDocuments={handleClickShareDocs}
              handleDeleteDocuments={() => handleShowDeleteModal(item.id)}
              title={
                item.docTitle.length > 20
                  ? item.docTitle.slice(0, 20) + "..."
                  : item.docTitle
              }
              description="Lorem Ipsum is simply dummy text of industry."
            />
          );
        })}
      </div>
      {closeModal ? (
        <CustomModal
          closeModal={closeModal}
          setCloseModal={setCloseModal}
          title="Are you sure ! You want to delete this item."
          iconImg={deleteIcon}
        >
          <div className={style.deleteBtnBox}>
            <CustomBtn btnName="Yes" onClick={handleClickDeleteDocs} />
            <CustomBtn btnName="Cancel" onClick={handleCancelDelete} />
          </div>
        </CustomModal>
      ) : null}
    </>
  );
};

export default Documents;
