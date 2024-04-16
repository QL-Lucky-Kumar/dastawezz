import styles from "./commonComponents.module.css";

interface CustomBtnValue {
  btnName?: string;
  onClick?: any;
  className?: string;
  type?: any;
  role?: string;
  disabled?: any;
  style?: any;
}

const CustomBtn = (props: CustomBtnValue) => {
  const { btnName, onClick, type, role, disabled, style } = props;
  return (
    <button
      onClick={onClick}
      className={styles.customBtnCss}
      type={type}
      role={role}
      disabled={disabled}
      style={style}
    >
      {btnName}
    </button>
  );
};

export default CustomBtn;
