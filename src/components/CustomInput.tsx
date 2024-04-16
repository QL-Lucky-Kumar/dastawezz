import style from "./commonComponents.module.css";

interface CustomInputValues {
  labelText?: string;
  errorText?: any;
  type?: string;
  onChange?: any;
  placeholder?: string;
  id?: any;
  value?: any;
  name?:string;
  onBlur?:any;
}

const CustomInput = (props: CustomInputValues) => {
  const { errorText, type, onChange, placeholder, id, value,name,onBlur } = props;
  return (
    <>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        id={id}
        value={value}
        className={style.inputCustom}
        name={name}
        onBlur={onBlur}
      />
      <div className={style.errorText}>
        <p>{errorText}</p>
      </div>
    </>
  );
};

export default CustomInput;
