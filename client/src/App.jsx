import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ui";
import PageLoader from "./components/ui/PageLoader";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
