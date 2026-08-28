export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f12]">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-[2px] border-black/[0.06] dark:border-white/[0.08]" />
        <div
          className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-[#6366f1] animate-spin"
          style={{ animationDuration: "0.6s" }}
        />
        <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]" />
      </div>
    </div>
  );
}
