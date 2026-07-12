import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "./components/ui";
import PageLoader from "./components/ui/PageLoader";
import router from "./routes/router";

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
