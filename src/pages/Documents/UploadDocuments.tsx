import { useState } from "react";
import CustomBtn from "../../components/CustomBtn";
import style from "./documents.module.css";
import CustomModal from "../../components/CustomModal";
import CustomInput from "../../components/CustomInput";
import { db, fileDB } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "@firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const UploadDocuments = () => {
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [docFile, setDocFile] = useState<any>();
  const [docTitle, setDocTitle] = useState<any>("");
  const [percent, setPercent] = useState(0);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setCloseModal(!closeModal);
    setDocTitle("");
    setDocFile("");
  };

  const handleUploadFile = async (e: any) => {
    try {
      const file = e?.target?.files?.[0];
      if (!file) return;
      const fileRef = ref(fileDB, `allDocuments/${file.name + uuidv4()}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on("state_changed", (snapshot: any) => {
        const progressVal = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(progressVal);
      });
      await uploadTask;
      const downloadURL = await getDownloadURL(fileRef);
      setDocFile(downloadURL);
    } catch (error) {
      console.error("Error occurred during file upload:", error);
    }
  };

  console.log(percent, "percent hello");
  const handleSubmitForm = async (e: any) => {
    try {
      e.preventDefault();
      let docInst = collection(db, "document");
      await addDoc(docInst, { docTitle, docFile });
      setCloseModal(false);
      navigate("/documents-list");
      toast.success("Add Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={style.uploadBox}>
        <div className={style.uploadtypography_1}>
          <h1>Publish to the Dastawezz</h1>
          <p style={{ color: "#000" }}>
            Presentations, research papers, legal documents, and more
          </p>
        </div>
        <div className={style.uploadBtnBox}>
          <CustomBtn btnName="Upload" onClick={handleOpenModal} />
        </div>
      </div>
      {closeModal ? (
        <CustomModal
          closeModal={closeModal}
          setCloseModal={setCloseModal}
          title="Upload Documents"
        >
          <form onSubmit={handleSubmitForm} autoComplete="off">
            <div className={style.inputBox}>
              <CustomInput
                placeholder="Title"
                type="text"
                id="title"
                name="title"
                value={docTitle}
                onChange={(e: any) => setDocTitle(e?.target?.value)}
              />
              <CustomInput
                placeholder="Upload File"
                type="file"
                id="document"
                name="document"
                onChange={(e: any) => handleUploadFile(e)}
              />
            </div>
            {percent > 1 ? (
              <progress
                id="file"
                value={percent}
                max="100"
                className={style.progressBar}
              />
            ) : null}

            <div className={style.modalFooter}>
              <CustomBtn btnName="Submit" />
            </div>
          </form>
        </CustomModal>
      ) : null}
    </>
  );
};

export default UploadDocuments;
