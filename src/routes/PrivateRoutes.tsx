import { Navigate, useRoutes } from "react-router-dom";
import Documents from "../pages/Documents";
import Layout from "../layout";
import Editor from "../pages/DocEditor";

const PrivateRoutes = () => {
  const AllPrivateRoutes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "documents-list",
          element: <Documents />,
        },
        {
          path: "/",
          element: <Navigate replace to="documents-list" />,
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
