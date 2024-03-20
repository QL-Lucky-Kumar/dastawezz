import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MyEditor = () => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = ({ content, editor }: any) => {
    console.log("Content was updated:", content);
  };

  const handleLogClick = () => {
    if (editorRef.current) {
      console.log(editorRef?.current?.getContent());
    }
  };

  return (
    <>
      <Editor
        apiKey="u1vpilqz6jznef51h5voqb5u7fqa4xi8m0ejfqq4wg4a36uu"
        onInit={({ evt, editor }: any) => (editorRef.current = editor)}
        initialValue=""
        init={{
          height: "95vh",
          menu: {
            edit: { title: "Edit", items: "undo, redo, selectall" },
          },
          toolbar_location: "top", // Set toolbar location to top
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        }}
        onEditorChange={handleEditorChange}
      />
      {/* <button onClick={handleLogClick}>Log editor content</button> */}
    </>
  );
};

export default MyEditor;
