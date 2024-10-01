import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomBtn from "../../components/CustomBtn";
import CustomInput from "../../components/CustomInput";
import style from "./login.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { accessAdminTokken, getUserIdForUniqueUser } from "../../redux/slices/loginSlice";
import { toast } from "react-toastify";

const auth = getAuth(app);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      const value: any = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      if (value?.user && value?.user?.accessToken) {
        dispatch(accessAdminTokken(value?.user?.accessToken));
        dispatch(getUserIdForUniqueUser(value?.user?.uid))
        navigate("/admin/dashboard");
        toast.success("Successfully Login");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={style.loginBanner}>
      <div className={style.formHeading}>
        <h1 className="ubuntu-bold">Welcome To Dastawezz !</h1>
      </div>
      <div className={style.loginFormBox}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className={style.formWrap}>
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  as={CustomInput}
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  as={CustomInput}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
              <div className={style.registerLink}>
                <p>
                  Don't Have Account | <Link to="/register"> Register Now</Link>
                </p>
              </div>
              <div>
                <CustomBtn
                  btnName="Login"
                  type="submit"
                  role="button"
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
