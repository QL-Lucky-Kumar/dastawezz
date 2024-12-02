import { useState } from "react";
import CustomBtn from "../../components/CustomBtn";
import style from "./documents.module.css";
import CustomModal from "../../components/CustomModal";
import CustomInput from "../../components/CustomInput";
import { db, fileDB } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
// useID
import { addDoc, collection } from "@firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import uploadIcon from "../../assets/upload.png";

const UploadDocuments = () => {
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [docFile, setDocFile] = useState<any>();
  const [docTitle, setDocTitle] = useState<any>("");
  const [percent, setPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setCloseModal(!closeModal);
    setDocTitle("");
    setDocFile("");
    setErrorMsg(false);
  };

  const handleUploadFile = async (e: any) => {
    try {
      const file = e?.target?.files?.[0];
      const newFile = file.name.split(".");
      if (!newFile[1]) return;
      if (newFile[1] === "docx" || newFile[1] === "txt") {
        const fileRef = ref(fileDB, `allDocuments/${file.name + uuidv4()}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on("state_changed", (snapshot: any) => {
          const progressVal = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(progressVal);
          if (progressVal == 100) {
            setPercent(0);
          }
        });
        await uploadTask;
        const downloadURL = await getDownloadURL(fileRef);
        setDocFile(downloadURL);
      }
    } catch (error) {
      console.error("Error occurred during file upload:", error);
    }
  };

  const handleSubmitForm = async (e: any) => {
    try {
      e.preventDefault();
      if (!docTitle || !docFile) {
        setErrorMsg(true);
        return;
      }
      let docInst = collection(db, "document");
      await addDoc(docInst, { docTitle, docFile });
      setCloseModal(false);
      navigate("/documents-list");
      toast.success("Added Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CustomBtn
        btnName="Upload"
        onClick={handleOpenModal}
        style={{ width: "100%" }}
      />
      {closeModal ? (
        <CustomModal
          closeModal={closeModal}
          setCloseModal={setCloseModal}
          title="Upload Documents"
          iconImg={uploadIcon}
        >
          <form onSubmit={handleSubmitForm} autoComplete="off">
            <div className={style.inputBox}>
              <div>
                <CustomInput
                  placeholder="Title"
                  type="text"
                  id="title"
                  name="title"
                  value={docTitle}
                  onChange={(e: any) => setDocTitle(e?.target?.value)}
                  errorText={
                    docTitle == "" && errorMsg ? "Title is Required" : null
                  }
                />
              </div>
              <div>
                <CustomInput
                  placeholder="Upload File"
                  type="file"
                  id="document"
                  name="document"
                  onChange={(e: any) => handleUploadFile(e)}
                  errorText={
                    docFile == "" && errorMsg
                      ? "Only Accept txt or docx files"
                      : null
                  }
                />
              </div>
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
              <CustomBtn btnName="Submit" style={{ width: "100%" }} />
            </div>
          </form>
        </CustomModal>
      ) : null}
    </>
  );
};

export default UploadDocuments;
