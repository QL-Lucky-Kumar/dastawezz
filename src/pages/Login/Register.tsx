import CustomBtn from "../../components/CustomBtn";
import CustomInput from "../../components/CustomInput";
import style from "./login.module.css";
import "firebase/auth";
import { useNavigate } from "react-router";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { app } from "../../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import backBtn from "../../assets/back-button.png";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const auth = getAuth(app);

const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      resetForm();
      navigate("/login");
    } catch (err) {
      console.error("User creation failed:", err);
    }
  };

  const handleBackBtn =()=>{
    navigate('/login')
  }

  return (
    <div className={style.loginBanner}>
      <img src={backBtn} alt="back-btn" width={40} className={style.backBtn} onClick={handleBackBtn}/>
      <div className={style.formHeading}>
        <h1 className="ubuntu-bold">Register Your Dastawezz!</h1>
      </div>
      <div className={style.loginFormBox}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className={style.formWrap} autoComplete="off">
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Name"
                  as={CustomInput}
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
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
                  placeholder="Create Password"
                  as={CustomInput}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  as={CustomInput}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <CustomBtn btnName="Register" type="submit" role="button" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
