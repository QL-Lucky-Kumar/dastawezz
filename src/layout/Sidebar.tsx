import { Link, useLocation } from "react-router-dom";
import style from "./layout.module.css";

const Sidebar = () => {
  const menuItems = [
    {
      to: "/upload-documents",
      label: "Upload Documents",
    },
    { to: "/documents-list", label: "Documents List" },
  ];

  type MenuItem = {
    to: string;
    label: string;
  };

  const { pathname } = useLocation();

  return (
    <div className={style.sidebarBox}>
      <div className={style.logoSevction}>
        <h1>Dastawezz</h1>
      </div>
      <div className={style.menuSection}>
        <ul>
          {menuItems.map((item: MenuItem, index: number) => {
            return (
              <Link to={item.to} key={index}>
                <li className={pathname === item.to ? "activeMenu" : " "}>
                  {item.label}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
