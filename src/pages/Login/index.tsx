import { Link } from "react-router-dom";
import CustomBtn from "../../components/CustomBtn";
import CustomInput from "../../components/CustomInput";
import style from "./login.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import { useState } from "react";
import { toast } from "react-toastify";

const auth = getAuth(app);
const Login = () => {
  const [emailValue, setEmailValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsDisabled(false);
    try {
      const value: any = await signInWithEmailAndPassword(
        auth,
        emailValue,
        password
      );
      if (value?.user && value?.user?.accessToken) {
        setIsDisabled(true);
        localStorage.setItem("token", JSON.stringify(value?.user?.accessToken));
        toast.success("Logged in", {
          // position: toast.POSITION.TOP_RIGHT,
        });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error("error", {
        // position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <div className={style.loginBanner}>
      <div className={style.formHeading}>
        <h1 className="ubuntu-bold">Welcome To Dastawezz !</h1>
      </div>
      <div className={style.loginFormBox}>
        <form className={style.formWrap} onSubmit={handleLogin}>
          <div>
            <CustomInput
              placeholder="Email"
              type="email"
              value={emailValue}
              onChange={(e: any) => setEmailValue(e.target.value)}
            />
          </div>
          <div>
            <CustomInput
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <div className={style.registerLink}>
            <p>
              Don't Have Account |<Link to="/register"> Register Now</Link>
            </p>
          </div>
          <div>
            <CustomBtn btnName="Login" type="submit" role="button" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
