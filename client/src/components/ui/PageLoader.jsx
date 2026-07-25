import { Spinner } from "./GlobalLoader";

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f12]">
      <Spinner />
    </div>
  );
}
