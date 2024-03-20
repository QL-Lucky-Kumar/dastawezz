import { useState } from "react";
import CustomBtn from "../../components/CustomBtn";
import style from "./documents.module.css";
import CustomModal from "../../components/CustomModal";

const UploadDocuments = () => {
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setCloseModal(!closeModal);
  };
  return (
    <>
      <div className={style.uploadBox}>
        <div className={style.uploadtypography_1}>
          <h1>Publish to the Dastawezz</h1>
          <p style={{color:"#000"}}>Presentations, research papers, legal documents, and more</p>
        </div>
        <div className={style.uploadBtnBox}>
          <CustomBtn btnName="Upload" onClick={handleOpenModal} />
        </div>
      </div>
      {closeModal ? (
        <CustomModal closeModal={closeModal} setCloseModal={setCloseModal} />
      ) : null}
    </>
  );
};

export default UploadDocuments;
