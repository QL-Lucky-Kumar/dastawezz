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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QuillResizeImage from "quill-resize-image";
import Quill from "quill";
import {
  getDocById,
  handleDocOperations,
  updateDocById,
} from "../../common/utils";
import {
  AFFECTED_DOC_TYPE,
  CHANGE_LOG,
  DB_COLLECTION,
  LOCAL_DOCS_TYPE,
  OPERATION_TYPE,
  QUERY_DOC_TYPE,
  USER_TYPE,
} from "../../common/common.types";
import { setGlobalDocId } from "../../redux/slices/docValueSlice";
import Loader from "../../components/Loader";
import imgLoader from "../../assets/loader.png";
import useDebounce from "../../hooks/useDebounce";

const MyEditor = () => {
  const isInitialRender = useRef<boolean>(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("doctype");

  const reactQuillRef = useRef<ReactQuill | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const [docTitle, setDocTitle] = useState<string>("");
  const [docCreatedBy, setDocCreatedBy] = useState<string>("");
  const [fetchingDoc, setFetchingDoc] = useState<boolean>(false);
  const [savingDoc, setSavingDoc] = useState<boolean>(false);
  const [deletingDoc, setDeletingDoc] = useState<boolean>(false);

  const debouncedTitle = useDebounce<string>(docTitle.trim(), 1000);
  const debouncedContent = useDebounce<string | undefined>(
    reactQuillRef?.current?.getEditor().getText().trim(),
    1000
  );

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

  const handleDocDelete = useCallback(async () => {
    setDeletingDoc(true);

    try {
      if (
        !reactQuillRef?.current?.getEditor().getText().trim().length &&
        !docTitle.trim().length
      ) {
        const affectedDocs: AFFECTED_DOC_TYPE[] = [
          {
            docId: userId,
            operationsType: OPERATION_TYPE.delete,
            docCollection: DB_COLLECTION.users,
          },
        ];
        await handleDocOperations(
          affectedDocs,
          OPERATION_TYPE.delete,
          DB_COLLECTION.localDocs,
          id || globalDocID
        );
        dispatch(setGlobalDocId(""));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingDoc(false);
    }
  }, [
    reactQuillRef?.current?.getEditor().getText().trim(),
    docTitle.trim(),
    id,
  ]);

  const handleBackBtn = useCallback(async () => {
    await handleDocDelete();
    navigate("/documents-list");
  }, [handleDocDelete]);

  const fetchDocData = useCallback(async () => {
    if (!id && !globalDocID) return;

    if (query !== QUERY_DOC_TYPE.edit) return;

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
      const docOwner = await getDocById<USER_TYPE>(
        DB_COLLECTION.users,
        createdBy
      );
      setDocCreatedBy(docOwner.name);
      setDocContent(htmlContent);
      setDocTitle(title);
    } catch (error) {
      toast.error("Unable to fetch Doc details");
      console.error(error);
      navigate(-1);
    } finally {
      setFetchingDoc(false);
    }
  }, [id, globalDocID, query]);

  useEffect(() => {
    if (reactQuillRef.current) {
      const quill = reactQuillRef.current.getEditor() as unknown as Quill;
      QuillResizeImage(quill);
    }
    fetchDocData();
  }, [fetchDocData]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setDocContent(result.value);
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  const saveContent = useCallback(async () => {
    if (!debouncedContent?.length) return;
    if (isInitialRender.current && query === QUERY_DOC_TYPE.edit) {
      isInitialRender.current = false;
      return;
    }

    if (!id) return toast.error("Could not detect ID");
    setSavingDoc(true);
    try {
      const newChangeLog: CHANGE_LOG = {
        userId: userId,
        time: new Date().toLocaleString(),
      };
      await updateDocById(DB_COLLECTION.localDocs, id, {
        htmlContent: docContent,
        docTitle: debouncedTitle.trim(),
        changeLogs: arrayUnion(newChangeLog),
      });
    } catch (error) {
      toast.error("Unable to update");
      console.error(error);
    } finally {
      setSavingDoc(false);
    }
  }, [debouncedContent, debouncedTitle, id, userId]);

  useEffect(() => {
    saveContent();
  }, [saveContent]);

  const handlePickTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDocTitle(e.target?.value);
  }, []);

  return (
    <>
      {(fetchingDoc || deletingDoc) && <Loader />}
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

          {savingDoc && (
            <img src={imgLoader} alt="Saving..." className={style.loaderImg} />
          )}
        </div>
        {!fetchingDoc && (
          <div className={style.docEditorNameAndUsersContainer}>
            <div>
              Created By <span className={style.mainText}>{docCreatedBy}</span>
            </div>
            <div>
              Live Users <span className={style.mainText}>USER</span>
            </div>
          </div>
        )}
      </div>
      <ReactQuill
        ref={reactQuillRef}
        modules={modules}
        theme="snow"
        value={docContent}
        onChange={setDocContent}
        className={style.quill}
      />
    </>
  );
};

export default MyEditor;
