import { Navigate, useRoutes } from "react-router-dom";
import Documents from "../pages/Documents";
import Layout from "../layout";
import UploadDocuments from "../pages/Documents/UploadDocuments";
import Editor from "../pages/DocEditor";

const PrivateRoutes = () => {
  const AllPrivateRoutes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "upload-documents",
          element: <UploadDocuments />,
        },
        {
          path: "/",
          element: <Navigate replace to="upload-documents" />,
        },
        {
          path: "documents-list",
          element: <Documents />,
        },
        {
          path: "edit-docs",
          element: <Editor />,
        },
        {
          path: "*",
          element: <Navigate to="/" />,
        },
      ],
    },
  ]);
  return AllPrivateRoutes;
};
export default PrivateRoutes;
