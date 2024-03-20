import CustomBtn from "../../components/CustomBtn";
import CustomInput from "../../components/CustomInput";
import style from "./login.module.css";

const Register = () => {
  return (
    <div className={style.loginBanner}>
      <div className={style.formHeading}>
        <h1 className="ubuntu-bold">Register Your Dastawezz!</h1>
      </div>
      <div className={style.loginFormBox}>
        <form className={style.formWrap}>
          <div>
            <CustomInput placeholder="Name" type="Text" errorText="hello" />
          </div>
          <div>
            <CustomInput placeholder="Email" type="Email" />
          </div>
          <div>
            <CustomInput placeholder="Phone" type="phone" />
          </div>
          <div>
            <CustomInput placeholder="Create Password" type="password" />
          </div>
          <div>
            <CustomInput placeholder="Confirm Password" type="password" />
          </div>
          <div>
            <CustomBtn btnName="Register" type="submit" role="button" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
