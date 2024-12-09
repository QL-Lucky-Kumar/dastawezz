import { useNavigate } from "react-router-dom";
import DocumentCard from "./DocumentCard";
import style from "./documents.module.css";
import plus from "../../assets/plus.png";
import { useCallback, useEffect, useState } from "react";
import dummyPic from "../../assets/dummyPic.png";
import CustomModal from "../../components/CustomModal";
import CustomBtn from "../../components/CustomBtn";
import { toast } from "react-toastify";
import deleteIcon from "../../assets/delete_.png";
import shareIcon from "../../assets/share.png";
import CustomInput from "../../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalDocId } from "../../redux/slices/docValueSlice";
import EmptyCase from "./EmptyCase";
import { RootState } from "../../redux/store";
import {
  getFilteredLocalDocData,
  handleDocOperations,
} from "../../common/utils";
import {
  AFFECTED_DOC_TYPE,
  DB_COLLECTION,
  OPERATION_TYPE,
  QUERY_DOC_TYPE,
} from "../../common/common.types";
import Loader from "../../components/Loader";

const Documents = () => {
  const [localDocList, setLocalDocList] = useState<any>();
  const [editorDocId, setEditorDocId] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [creatingNewDoc, setCreatingNewDoc] = useState<boolean>(false);
  const [fetchingDocData, setFetchingDocData] = useState<boolean>(false);
  const [shareDocs, setShareDocs] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickShareDocs = () => {
    setShareDocs(true);
  };

  const userId = useSelector((state: RootState) => {
    return state.loginToken.userId;
  });

  const handleClickEdit = (item: any) => {
    const matchId = localDocList.find((data: any) => {
      return data.id === item.id;
    });
    dispatch(setGlobalDocId(matchId.id));
    navigate(`/doc/${matchId.id}?doctype=${QUERY_DOC_TYPE.edit}`);
  };

  const handleOpenDocEditor = useCallback(async () => {
    setCreatingNewDoc(true)
    try {
      const affectedDocs:AFFECTED_DOC_TYPE[] = [
        {
          docId: userId,
          operationsType: OPERATION_TYPE.add,
          docCollection: DB_COLLECTION.users,
        },
      ];
      const newDocId = await handleDocOperations(
        affectedDocs,
        OPERATION_TYPE.add,
        DB_COLLECTION.localDocs,
        undefined,
        {
          htmlContent: "",
          docTitle: "",
          createdBy: userId,
        }
      );

      dispatch(setGlobalDocId(newDocId));
      navigate(`/doc/${newDocId}?doctype=${QUERY_DOC_TYPE.new}`);
    } catch (error) {
      toast.error("Unable to fetch Doc details");
      console.error(error);
    } finally {
      setCreatingNewDoc(false)

    }
  }, [userId]);

  const handleCancelDelete = () => {
    setShowEditModal(false);
  };

  const handleDeleteEditorDoc = (id: string) => {
    setShowEditModal(true);
    setEditorDocId(id);
  };

  const getDocData = useCallback(async () => {
    setFetchingDocData(true);
    try {
      const docs = await getFilteredLocalDocData(userId);
      setLocalDocList(docs);
    } catch (error) {
      toast.error("Unable to fetch Docs");
      console.error(error);
    } finally {
      setFetchingDocData(false);
    }
  }, [userId]);

  const handleClickDeleteEditorDoc = useCallback(async () => {
    try {
      const affectedDocs:AFFECTED_DOC_TYPE[] = [
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
        editorDocId
      );
      getDocData();
      setShowEditModal(false);
      toast.success("Deleted Successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }, [editorDocId,userId]);

  useEffect(() => {
    getDocData();
  }, [getDocData]);

  return (
    <>
    {creatingNewDoc && <Loader/>}
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
        <>
          {fetchingDocData ? (
            <Loader />
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
      )}
    </>
  );
};

export default Documents;
