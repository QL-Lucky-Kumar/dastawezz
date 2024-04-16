import style from "./commonComponents.module.css";
import closeIcon from "../assets/close.png";

const CustomModal = (props: any) => {
  const { setCloseModal, children, title, iconImg } = props;
  const handleCloseModal = () => {
    setCloseModal(false);
  };
  return (
    <>
      <div className={style.mainModalWrap}>
        <div className={style.modalWrapper}>
          <img src={closeIcon} alt="close-icon" onClick={handleCloseModal} />
          <div className={style.modalHeader}>
            <div className={style.iconBox}>
              <img src={iconImg} alt="icon" width={24}/>
            </div>
            <h2>{title}</h2>
          </div>
          <div className={style.modalBody}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default CustomModal;
