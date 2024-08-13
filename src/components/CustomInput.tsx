import style from "./commonComponents.module.css";

interface CustomInputValues {
  labelText?: string;
  errorText?: string | null;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  value?: string;
  name?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
