import { Suspense, useEffect, useRef } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ui";
import PageLoader from "./components/ui/PageLoader";
import GlobalLoader from "./components/ui/GlobalLoader";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import AppRoutes from "./routes/AppRoutes";

function NavigationListener() {
  const { pathname } = useLocation();
  const { startNavigation, stopNavigation } = useLoading();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    startNavigation();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        stopNavigation();
      });
    });
  }, [pathname, startNavigation, stopNavigation]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <NavigationListener />
              <GlobalLoader />
              <Suspense fallback={<PageLoader />}>
                <AppRoutes />
              </Suspense>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
