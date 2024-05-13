import { Outlet } from "react-router-dom";
import style from "./layout.module.css";
import { Suspense } from "react";
import Header from "./Header";

const CustomLayout = () => {
  return (
    <div className={style.layoutWrapper}>
      <Header />
      <div className={style.layoutMainWrapper}>
        <Suspense fallback="...Loading">
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default CustomLayout;
