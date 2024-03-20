import { useNavigate } from "react-router-dom";
import DocumentCard from "./DocumentCard";
import style from "./documents.module.css";

const Documents = () => {
  const navigate = useNavigate();
  const handleClickShareDocs = () => {
    alert("hello share");
  };
  const handleClickEditDocs = () => {
    navigate('/edit-docs')
  };
  const handleClickDeleteDocs = () => {
    alert("hello delete");
  };
  return (
    <div className={style.documentsCardListing}>
      <DocumentCard
        handleEditDocuments={handleClickEditDocs}
        handleShareDocuments={handleClickShareDocs}
        handleDeleteDocuments={handleClickDeleteDocs}
        title="What is Lorem Ipsum?"
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
    </div>
  );
};

export default Documents;
