import styles from "./documents.module.css";
import shareIcon from "../../assets/next.png";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";

const DocumentCard = (props: any) => {
  const {
    handleEditDocuments,
    handleShareDocuments,
    title,
    handleDeleteDocuments,
    docImage
  } = props;
  return (
    <div className={styles.mainDocumentCardBox}>
      <img src={docImage} alt="doc-pic" width={100} className={styles.docImage}/>
      <div className={styles.overlayMaskDocument}>
        <div className={styles.typography_1}>
          <h4 className={styles.title}>{title}</h4>
        </div>
        <div className={styles.iconBox}>
          <img
            src={editIcon}
            alt="doc-pic"
            width={16}
            height={16}
            onClick={handleEditDocuments}
          />
          <img
            src={deleteIcon}
            alt="doc-pic"
            width={16}
            height={16}
            onClick={handleDeleteDocuments}
          />
          <img
            src={shareIcon}
            alt="doc-pic"
            width={16}
            height={16}
            onClick={handleShareDocuments}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
