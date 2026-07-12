export default function PageLoader({ variant = "default" }) {
  if (variant === "dashboard") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-xl bg-blue-500/20 animate-ping" />
            <div className="relative w-full h-full rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            </div>
          </div>
          <p className="text-sm text-white/30 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f12]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-xl bg-cyan-500/20 animate-ping" />
          <div className="relative w-full h-full rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>
        </div>
        <p className="text-sm text-base-content/30 font-medium">Loading...</p>
      </div>
    </div>
  );
}
