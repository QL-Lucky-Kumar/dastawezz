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
import deleteIcon from "../../assets/delete_.png";
import shareIcon from "../../assets/share.png";
import CustomInput from "../../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { getDocumentValue } from "../../redux/slices/docValueSlice";
import EmptyCase from "./EmptyCase";
import { RootState } from "../../redux/store";

const Documents = () => {
  const [localDocList, setLocalDocList] = useState<any>();
  const [editorDocId, setEditorDocId] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [shareDocs, setShareDocs] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickShareDocs = async (nextPageToken: any) => {
    setShareDocs(true);
    console.log(nextPageToken);
  };

  const getUser = useSelector((state: RootState) => {
    return state.loginToken.userId;
  });

  const handleClickEdit = (item: any) => {
    const matchId = localDocList.find((data: any) => {
      return data.id === item.id;
    });
    dispatch(getDocumentValue(matchId));
    navigate(`/doc/${matchId.id}`);
  };

  const handleOpenDocEditor = () => {
    navigate("/doc/new");
    dispatch(getDocumentValue(""));
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
      const filterDocList = result?.filter((item: any) => {
        return item?.getUserID === getUser;
      });

      setLocalDocList(filterDocList);
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

  useEffect(() => {
    getLocalDocData();
  }, []);

  return (
    <>
      {localDocList?.length >= 1 ? (
        <div className={style.wrapperAllBox}>
          <div className={style.mainDocumentListingBox}>
            <div className={style.otherTextBtnBox}>
              <h3 style={{ marginBottom: "0.5rem" }}>Create Your Document</h3>
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
                    title={
                      item.docTitle
                        ? item.docTitle?.length > 15
                          ? item.docTitle?.slice(0, 15) + "..."
                          : item.docTitle
                        : "Untitled Document"
                    }
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
      ) : (
        <div className={style.emptyCaseBox}>
          <EmptyCase />
          <div className={style.backHomeBtn}>
            <CustomBtn
              btnName="Create Your Document"
              onClick={handleOpenDocEditor}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Documents;
