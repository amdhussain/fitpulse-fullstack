import { Suspense } from "react";
import PageLoader from "../components/ui/PageLoader";

export function RouteSuspense({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export function DashboardSuspense({ children }) {
  return <Suspense fallback={<PageLoader variant="dashboard" />}>{children}</Suspense>;
}
