import { Suspense } from "react";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import "react-quill/dist/quill.snow.css";
import Loader from "./components/Loader";

function App() {
  const storedToken = useSelector((state:RootState) => state.loginToken.accessToken);
  return (
    <Suspense fallback={<Loader/>}>
      {!!storedToken ? <PrivateRoutes /> : <PublicRoutes />}
    </Suspense>
  );
}

export default App;