import { Outlet } from "react-router-dom";
import style from "./layout.module.css";
import { Suspense } from "react";
import Header from "./Header";
import Loader from "../components/Loader";

const CustomLayout = () => {
  return (
    <div className={style.layoutWrapper}>
      <Header />
      <div className={style.layoutMainWrapper}>
        <Suspense fallback={<Loader/>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default CustomLayout;
