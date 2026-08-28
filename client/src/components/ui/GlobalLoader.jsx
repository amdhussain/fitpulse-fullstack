import { useLoading } from "../../context/LoadingContext";

export default function GlobalLoader() {
  const { loading } = useLoading();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className={`h-full rounded-r-full transition-all duration-200 ease-out ${
          loading
            ? "opacity-100 scale-x-100"
            : "opacity-0 scale-x-0"
        }`}
        style={{
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
          transformOrigin: "left",
          boxShadow: "0 0 12px rgba(99, 102, 241, 0.5)",
          animation: loading ? "progressBar 1.5s ease-in-out forwards" : "none",
        }}
      />
    </div>
  );
}

function Spinner() {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-[2px] border-black/[0.06] dark:border-white/[0.08]" />
      <div
        className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-[#6366f1] animate-spin"
        style={{ animationDuration: "0.6s" }}
      />
      <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] animate-pulse" />
    </div>
  );
}

export { Spinner };
