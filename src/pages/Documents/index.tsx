import { useNavigate } from "react-router-dom";
import DocumentCard from "./DocumentCard";
import style from "./documents.module.css";
import plus from "../../assets/plus.png";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import dummyPic from "../../assets/dummyPic.svg";

const Documents = () => {
  const navigate = useNavigate();
  const [docList, setDocList] = useState<any>();

  const handleClickShareDocs = () => {
    alert("hello share");
  };
  const handleClickEditDocs = () => {
    navigate("/edit-docs");
  };
  const handleClickDeleteDocs = () => {
    alert("hello delete");
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
    <div className={style.documentsCardListing}>
      <button className={style.addNewDoc} onClick={handleOpenDocEditor}>
        <img src={plus} alt="plus-icon" width={24} />
        <br />
        Add New Document
      </button>
      {docList?.map((item: any) => {
        return (
          <DocumentCard
            docImage={item.docFile ? item.docFile : dummyPic}
            key={item.id}
            handleEditDocuments={handleClickEditDocs}
            handleShareDocuments={handleClickShareDocs}
            handleDeleteDocuments={handleClickDeleteDocs}
            title={
              item.docTitle.length > 20
                ? item.docTitle.slice(0, 20) + "..."
                : item.docTitle
            }
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />
        );
      })}
    </div>
  );
};

export default Documents;
