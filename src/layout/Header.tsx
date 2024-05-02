import {useNavigate } from "react-router-dom";
import style from "./layout.module.css";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "@firebase/auth";
import { SketchPicker } from "react-color";
import logout from "../assets/logout.png";
import theme from "../assets/theme.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/slices/loginSlice";
import CustomModal from "../components/CustomModal";
import CustomBtn from "../components/CustomBtn";
import { getColorCode } from "../redux/slices/themeSlice";
import { toast } from "react-toastify";
import logoutIcon from "../assets/power.png"

const Header = () => {
  const [showColor, setShowColor] = useState<boolean>(false);
  const [colors, setColors] = useState<string>("");
  const navigate = useNavigate();
  const auth = getAuth();
  const dispatch = useDispatch();
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const themeColor = useSelector((state: any) => {
    return state?.themeSlice?.colorCode;
  });


  const handleShowColorPicker = () => {
    setShowColor(!showColor);
  };

  useEffect(() => {
    const newColorCode: any = document.documentElement.style.setProperty(
      "--primaryColor",
      themeColor
    );
    setColors(newColorCode);
  }, [themeColor]);

  const handlePickColor = (colors: any) => {
    if (colors) {
      dispatch(getColorCode(colors?.hex));
    }
  };

  const handleLogout: any = async () => {
    await signOut(auth)
      .then(() => {
        dispatch(logoutAction());
        navigate("/login");
        toast.success("Successfully Logout");
      })
      .catch((error: any) => {
        toast.error(error);
      });
  };

  const handleLogoutModal = () => {
    setCloseModal(true);
  };
  const handleCancelLogout = () => {
    setCloseModal(false);
  };

  return (
    <>
      <div className={style.sidebarBox}>
        <div className={style.logoSevction}>
          <h1>Dastawezz</h1>
        </div>
        <div className={style.logoutBox}>
          <img
            src={theme}
            alt="setting"
            onClick={handleShowColorPicker}
            width={16}
          />
          <img
            src={logout}
            alt="setting"
            onClick={handleLogoutModal}
            width={16}
          />
          {showColor ? (
            <div className={style.colorPicker}>
              <SketchPicker color={colors} onChangeComplete={handlePickColor} />
            </div>
          ) : null}
        </div>
      </div>

      {closeModal ? (
        <CustomModal
          closeModal={closeModal}
          setCloseModal={setCloseModal}
          title="Are you sure ! You want to logout."
          iconImg={logoutIcon}
        >
          <div className={style.btnBox}>
            <CustomBtn btnName="Yes" onClick={handleLogout} />
            <CustomBtn btnName="Cancel" onClick={handleCancelLogout} />
          </div>
        </CustomModal>
      ) : null}
    </>
  );
};

export default Header;
