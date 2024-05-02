import { useState } from "react";
import ReactQuill from "react-quill";
import style from "./editor.module.css";
import "react-quill/dist/quill.snow.css";
import backBtn from "../../assets/back-button.png";
import mammoth from "mammoth";

const MyEditor = (props:any) => {
  const { onChange, handleBackBtn } = props;
  const [htmlContent, setHtmlContent] = useState("");

  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", true, "large", "huge"] }],
    ["link", "image"],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
  ];
  const modules = {
    toolbar: toolbarOptions,
  };

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e:any) => {
      const arrayBuffer = e.target.result;
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
      onChange(result.value);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleHtmlChange = (content:any) => {
    setHtmlContent(content);
    onChange(content);
  };

  return (
    <>
      <div className={style.fullBoxWrapper}>
        <div className={style.editorSaveBtn}>
          <img
            src={backBtn}
            alt="back-btn"
            onClick={handleBackBtn}
            width={20}
            height={20}
          />
          <input
            placeholder="Untitled Document"
            className={style.titledDocument}
          />
          <input
            type="file"
            onChange={handleFileChange}
            placeholder="File"
            className={style.openFile}
          />
        </div>
      </div>
      <ReactQuill
        modules={modules}
        theme="snow"
        value={htmlContent}
        onChange={handleHtmlChange}
        className={style.quill}
      />
    </>
  );
};

export default MyEditor;
