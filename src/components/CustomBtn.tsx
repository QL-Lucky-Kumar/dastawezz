import styles from "./commonComponents.module.css";

interface CustomBtnValue {
  btnName?: string;
  onClick?: () => void;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  role?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  loading?:boolean
}
const CustomBtn = (props: CustomBtnValue) => {
  const { btnName, onClick, type, role, disabled, style ,loading} = props;
  return (
    <button
      onClick={onClick}
      className={styles.customBtnCss}
      type={type}
      role={role}
      disabled={disabled}
      style={style}
    >
      {loading ? <div className={styles.btnLoader}/>: <span>{btnName}</span>}
    </button>
  );
};

export default CustomBtn;
