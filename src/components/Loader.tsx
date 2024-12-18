import style from "./commonComponents.module.css";

const defaultTop = 10

const Loader = () => {
  return (
    <div className={style.overlay}>
      <div className={style.loader}>
        <div className={style.loaderLine} style={{top:`${defaultTop}px`}}/>
        <div className={style.loaderLine} style={{top:`${defaultTop * 2}px`}}/>
        <div className={style.loaderLine2} style={{top:`${defaultTop * 3}px`}}/>
        <div className={style.loaderLine3} style={{top:`${defaultTop * 5}px`}}/>
        <div className={style.loaderLine3} style={{top:`${defaultTop * 6}px`}}/>
        <div className={style.loaderLine3} style={{top:`${defaultTop * 7}px`}}/>
        <div className={style.loaderLine3} style={{top:`${defaultTop * 8}px`}}/>
        <div className={style.loaderLine2} style={{top:`${defaultTop * 10}px`}}/>
        <div className={style.loaderLine} style={{top:`${defaultTop * 11}px`}}/>
      </div>
    </div>
  );
};

export default Loader;
