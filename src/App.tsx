import { Suspense } from "react";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import { useSelector } from "react-redux";

function App() {
  const storedToken = useSelector((state: any) => {
    return state?.loginSlice?.accessToken;
  });
  
  return (
    <Suspense fallback="...Loading">
      {!!storedToken ? <PrivateRoutes /> : <PublicRoutes />}
    </Suspense>
  );
}

export default App;