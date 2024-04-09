import style from "./commonComponents.module.css";

interface CustomBtnValue {
  btnName?: string;
  onClick?: any;
  className?: string;
  type?: any;
  role?: string;
  disabled?: any;
}

const CustomBtn = (props: CustomBtnValue) => {
  const { btnName, onClick, type, role, disabled } = props;
  return (
    <button
      onClick={onClick}
      className={style.customBtnCss}
      type={type}
      role={role}
      disabled={disabled}
    >
      {btnName}
    </button>
  );
};

export default CustomBtn;
