import { useState, useEffect, useMemo, useRef, useCallback, ChangeEvent } from "react";
import ReactQuill from "react-quill";
import style from "./editor.module.css";
import "react-quill/dist/quill.snow.css";
import backBtn from "../../assets/back-button.png";
import mammoth from "mammoth";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getDocumentValue } from "../../redux/slices/docValueSlice";
import { RootState } from "../../redux/store";
import QuillResizeImage from 'quill-resize-image';
import Quill from "quill";
import { getDocById } from "../../common/utils";


// console.log(reactQuillRef?.current?.getEditor().getText()) GET CONTENT FROM QUILL DIRECTLY

const MyEditor = () => {

  const reactQuillRef = useRef<ReactQuill | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [docTitle, setDocTitle] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams()
  const getDocId = useSelector((state: RootState) => {
    return state.documentEditor.documentEditorValue;
  });

  const ownerId = useSelector((state: RootState) => {
    return state.loginToken.userId;
  });

  const toolbarOptions = useMemo(() => {
    return [
      [
        {
          font: [
            "sans-serif",
            "serif",
            "monospace",
            "roboto",
            "times-new-roman",
          ],
        },
      ],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", true, "large", "huge"] }],
      ["link", "image"],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ];
  }, []);

  const modules = useMemo(() => {
    return { toolbar: toolbarOptions };
  }, [toolbarOptions]);

  useEffect(() => {
    if(reactQuillRef.current){
      const quill = reactQuillRef.current.getEditor() as unknown as Quill
     QuillResizeImage(quill) 

    }
    // const fetchDocumentData = async () => {
    //   if (getDocId?.id) {
    //     const { htmlContent, docTitle }= await getDocById(id)
    //     setHtmlContent(htmlContent);
    //         setDocTitle(docTitle);
    //   }
    // };

    getDocById(id).then((res)=>{
      const { htmlContent, docTitle } = res
      setHtmlContent(htmlContent);
     setDocTitle(docTitle);
    }).catch((err)=>alert(err))
    
  }, []);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const arrayBuffer = e.target.result;
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleHtmlChange = (content: any) => {
    setHtmlContent(content);
  };

  const handleBackBtn = useCallback(() => {
    navigate("/document-list");
    dispatch(getDocumentValue(""));
  },[]);

  const handleSaveEditorContent = async () => {
    try {
      if (getDocId?.id) {
        const docRef = doc(db, "localDocs", getDocId.id);
        await updateDoc(docRef, {
          htmlContent,
          docTitle,
          getUserID: ownerId,
        });
        toast.success("Update Successfully");
      } else {
        const docInst = collection(db, "localDocs");
        await addDoc(docInst, { htmlContent, docTitle, getUserID: ownerId });
        toast.success("Add Successfully");
      }
      navigate("/documents-list");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePickTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDocTitle(e.target?.value);
  },[]);

  return (
    <>
      <div className={style.fullBoxWrapper}>
        <div className={style.editorSaveBtn}>
          <img
            src={backBtn}
            alt="back-btn"
            onClick={handleBackBtn}
            width={20}
            height={20}
          />
          <input
            placeholder="Untitled Document"
            className={style.titledDocument}
            value={docTitle}
            onChange={handlePickTitle}
          />

          <label htmlFor="inputTag" className={style.fileUploadBox}>
            Open File
            <input
              type="file"
              onChange={handleFileChange}
              placeholder="File"
              className={style.openFile}
              id="inputTag"
              disabled={getDocId ? true : false}
            />
          </label>

          <p className={style.fileUploadBox} onClick={handleSaveEditorContent}>
            Save File
          </p>
        </div>
      </div>
      <ReactQuill
        ref={reactQuillRef}
        modules={modules}
        theme="snow"
        value={htmlContent}
        onChange={handleHtmlChange}
        className={style.quill}
      />
    </>
  );
};

export default MyEditor;
