import { Suspense } from "react";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";

function App() {
  const loginToken = localStorage.getItem("token");
  return (
    <Suspense fallback="...Loading">
      {loginToken ? <PrivateRoutes /> : <PublicRoutes />}
    </Suspense>
  );
}

export default App;
