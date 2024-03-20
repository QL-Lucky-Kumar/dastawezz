import style from "./commonComponents.module.css";

interface CustomInputValues {
  labelText?: string;
  errorText?: string;
  type?: string;
  onChange?: any;
  placeholder?: string;
  id?: any;
  value?: any;
}

const CustomInput = (props: CustomInputValues) => {
  const { errorText, type, onChange, placeholder, id, value } = props;
  return (
    <>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        id={id}
        value={value}
        className={style.inputCustom}
      />
      <div className={style.errorText}>
        <p>{errorText}</p>
      </div>
    </>
  );
};

export default CustomInput;
