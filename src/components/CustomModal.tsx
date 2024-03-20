import style from "./commonComponents.module.css";
import closeIcon from "../assets/close.png";
import CustomInput from "./CustomInput";
import CustomBtn from "./CustomBtn";

const CustomModal = (props: any) => {
  const { setCloseModal } = props;
  const handleCloseModal = () => {
    setCloseModal(false);
  };
  return (
    <>
      <div className={style.mainModalWrap}>
        <div className={style.modalWrapper}>
          <img src={closeIcon} alt="close-icon" onClick={handleCloseModal} />
          <div className={style.modalHeader}>
            <h2>Upload Documents</h2>
          </div>
          <div className={style.modalBody}>
            <div>
              <CustomInput placeholder="Title" type="text" />
            </div>
            <div>
              <CustomInput placeholder="Upload File" type="file" />
            </div>
          </div>
          <div className={style.modalFooter}>
            <CustomBtn btnName="Submit" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomModal;
