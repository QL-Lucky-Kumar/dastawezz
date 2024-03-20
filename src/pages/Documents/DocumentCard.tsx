import styles from "./documents.module.css";
import dummyPic from "../../assets/dummyPic.svg";
import shareIcon from "../../assets/next.png";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";

const DocumentCard = (props: any) => {
  const {
    handleEditDocuments,
    handleShareDocuments,
    title,
    description,
    handleDeleteDocuments,
  } = props;
  return (
    <div className={styles.mainDocumentCardBox}>
      <img src={dummyPic} alt="doc-pic" />
      <div className={styles.overlayMaskDocument}>
        <div className={styles.typography_1}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.description}>{description}</p>
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
