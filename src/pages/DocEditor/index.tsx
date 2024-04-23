import ReactQuill from "react-quill";
import CustomBtn from "../../components/CustomBtn";
import style from "./editor.module.css";
import "react-quill/dist/quill.snow.css";

const MyEditor = (props: any) => {
  const { docFile, onClick, onChange, value, handleBackBtn } = props;

  const toolbarOptions = [
    ["link", "image"],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", true, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ];
  const module = {
    toolbar: toolbarOptions,
  };

  return (
    <>
      <div className={style.editorSaveBtn}>
        <CustomBtn btnName="Back" onClick={handleBackBtn} />
        <CustomBtn
          btnName="Save"
          onClick={onClick}
          disabled={docFile?.length < 1 ? true : false}
          style={
            docFile.length < 1
              ? {
                  backgroundColor: "grey",
                  border: "1px solid transparent",
                  cursor: "default",
                }
              : null
          }
        />
      </div>
      <ReactQuill
        modules={module}
        theme="snow"
        value={value}
        onChange={onChange}
        className={style.quill}
        placeholder="Type Here..."
      />
    </>
  );
};

export default MyEditor;
