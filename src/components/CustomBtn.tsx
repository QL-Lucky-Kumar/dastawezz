import style from "./commonComponents.module.css";

interface CustomBtnValue {
  btnName?: string;
  onClick?: any;
  className?: string;
  type?: any;
  role?:string;
}

const CustomBtn = (props: CustomBtnValue) => {
  const { btnName, onClick, type ,role} = props;
  return (
    <button onClick={onClick} className={style.customBtnCss} type={type} role={role}>
      {btnName}
    </button>
  );
};

export default CustomBtn;
