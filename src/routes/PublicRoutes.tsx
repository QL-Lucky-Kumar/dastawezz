import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Login/Register";

const PublicRoutes = () => {
  const AllPublicRoutes = useRoutes([
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Navigate replace to="/Login" />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);
  return AllPublicRoutes;
};

export default PublicRoutes;
