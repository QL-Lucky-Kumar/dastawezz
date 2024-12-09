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
import {  setDocById } from "../../common/utils";
import { DB_COLLECTION, USER_TYPE } from "../../common/common.types";
import { toast } from "react-toastify";
import { useCallback, useState } from "react";

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
  const [registeringUser,setRegisteringUser] = useState<boolean>(false)
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = useCallback( async (values: any, { resetForm }: any) => {
    setRegisteringUser(true)
    try {
      const createdAuthUser = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await setDocById<USER_TYPE>(DB_COLLECTION.users,createdAuthUser.user.uid,{name:values.name,email:values.email,docs:[],qlId:""})
      resetForm();
      navigate("/login");
    } catch (err) {
      toast.error("User creation failed");
      console.error( err);
    } finally {
      setRegisteringUser(false)

    }
  },[]);

  const handleBackBtn =()=>{
    navigate('/login')
  }

  return (
    <div className={style.loginBanner}>
      <img src={backBtn} alt="back-btn" width={40} className={style.backBtn} onClick={handleBackBtn}/>
      <div className={style.formHeading}>
        <h1 className="ubuntu-bold">{registeringUser ? "Registering your account..." :"Register Your Dastawezz!"}</h1>
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
                <CustomBtn loading={registeringUser} btnName="Register" type="submit" role="button" style={registeringUser ? {display:"flex",justifyContent:"center"} : {}}/>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
