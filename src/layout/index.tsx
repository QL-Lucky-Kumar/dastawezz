import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import style from "./layout.module.css";
import { Suspense } from "react";

const CustomLayout = () => {
  return (
    <div className={style.layoutWrapper}>
      <Sidebar />
      <div className={style.layoutMainWrapper}>
        <Suspense fallback="...Loading">
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default CustomLayout;
