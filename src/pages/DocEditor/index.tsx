import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  ChangeEvent,
} from "react";
import ReactQuill from "react-quill";
import style from "./editor.module.css";
import backBtn from "../../assets/back-button.png";
import mammoth from "mammoth";
import { useNavigate, useParams } from "react-router-dom";
import { arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QuillResizeImage from "quill-resize-image";
import Quill from "quill";
import { deleteDocById, getDocById, updateDocById } from "../../common/utils";
import {
  CHANGE_LOG,
  DB_COLLECTION,
  LOCAL_DOCS_TYPE,
} from "../../common/common.types";

// console.log(reactQuillRef?.current?.getEditor().getText()) GET CONTENT FROM QUILL DIRECTLY

const MyEditor = () => {
  const reactQuillRef = useRef<ReactQuill | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const [docTitle, setDocTitle] = useState<string>("");
  const [docCreatedBy, setDocCreatedBy] = useState<string>("");
  const [fetchingDoc, setFetchingDoc] = useState<boolean>(false);
  const [savingDoc, setSavingDoc] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const globalDocID = useSelector((state: RootState) => {
    return state.documentEditor.documentEditorValue;
  });

  const userId = useSelector((state: RootState) => {
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

  const fetchDocData = useCallback(async () => {

    if (id === "new" && !globalDocID) return;
    setFetchingDoc(true);
    try {
      const {
        htmlContent,
        docTitle: title,
        createdBy,
      } = await getDocById<LOCAL_DOCS_TYPE>(
        DB_COLLECTION.localDocs,
        id || globalDocID
      );
      setDocContent(htmlContent);
      setDocTitle(title);
      setDocCreatedBy(createdBy);
    } catch (error) {
      toast.error("Unable to fetch Doc details");
      console.error(error);
      navigate(-1);
    } finally {
      setFetchingDoc(false);
    }
  }, [id, globalDocID]);

  const handleDocDelete = async () => {
    try {
      if (
        !reactQuillRef?.current?.getEditor().getText().trim().length &&
        !docTitle.trim().length
      ) {
        console.log("called")
        await deleteDocById(DB_COLLECTION.localDocs, id || globalDocID);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleBackBtn = useCallback(async () => {
    
   await handleDocDelete();
    navigate("/documents-list");
  }, [handleDocDelete]);
  // }, [id,globalDocID,docTitle,reactQuillRef?.current?.getEditor().getText().trim()]);




  useEffect(() => {
    if (reactQuillRef.current) {
      const quill = reactQuillRef.current.getEditor() as unknown as Quill;
      QuillResizeImage(quill);
    }
    fetchDocData();
    window.addEventListener('beforeunload',(e)=>{
      e.preventDefault()
      return (e.returnValue="")
    },{capture:true})

    return () => {
    // console.log(
    //     window.location.pathname.split("/")[
    //       window.location.pathname.split("/").length - 1
    //     ],id
    //   )
    window.removeEventListener('beforeunload',(e)=>{
      e.preventDefault()
      return (e.returnValue="")
    },{capture:true})
    };
  }, [fetchDocData]);


  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const arrayBuffer = e.target.result;
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocContent(result.value);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleHtmlChange = (content: any) => {
    setDocContent(content);
  };

  const saveContent = useCallback(async () => {
    if (
      !reactQuillRef?.current?.getEditor().getText().trim().length &&
      !docTitle.trim().length
    )
      return;
    if (!id) return toast.error("Could not detect ID");
    setSavingDoc(true);
    try {
      const newChangeLog: CHANGE_LOG = {
        userId: userId,
        time: new Date().toLocaleString(),
      };
      await updateDocById(DB_COLLECTION.localDocs, id, {
        htmlContent: docContent,
        docTitle,
        changeLogs: arrayUnion(newChangeLog),
      });
    } catch (error) {
      toast.error("Unable to update");
      console.error(error);
    } finally {
      setSavingDoc(false);
    }
  }, [
    id,
    docTitle,
    docContent,
    userId,
    docTitle,
    reactQuillRef?.current?.getEditor().getText().trim(),
  ]);

  const handlePickTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDocTitle(e.target?.value);
  }, []);

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
              disabled={globalDocID ? true : false}
            />
          </label>

          <p className={style.fileUploadBox} onClick={saveContent}>
            Save File
          </p>
        </div>
      </div>
      <ReactQuill
        ref={reactQuillRef}
        modules={modules}
        theme="snow"
        value={docContent}
        onChange={handleHtmlChange}
        className={style.quill}
      />
    </>
  );
};

export default MyEditor;
