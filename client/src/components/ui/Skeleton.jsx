import PropTypes from "prop-types";

function Skeleton({ className = "", variant = "block" }) {
  const variants = {
    block: "animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700/50",
    shimmer: "rounded-xl bg-gray-100 dark:bg-gray-700/50 skeleton-shimmer",
    circle: "animate-pulse rounded-full bg-gray-100 dark:bg-gray-700/50",
    text: "animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700/50",
  };

  return (
    <div
      className={`${variants[variant] || variants.block} ${className}`}
      aria-hidden="true"
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["block", "shimmer", "circle", "text"]),
};

export function DashboardSkeleton({ accent = "blue" }) {
  const accentGradients = {
    blue: "from-blue-50 dark:from-blue-950/30",
    orange: "from-orange-50 dark:from-orange-950/30",
    purple: "from-purple-50 dark:from-purple-950/30",
    indigo: "from-indigo-50 dark:from-indigo-950/30",
    emerald: "from-emerald-50 dark:from-emerald-950/30",
    cyan: "from-cyan-50 dark:from-cyan-950/30",
    yellow: "from-yellow-50 dark:from-yellow-950/30",
    pink: "from-pink-50 dark:from-pink-950/30",
    sky: "from-sky-50 dark:from-sky-950/30",
    red: "from-red-50 dark:from-red-950/30",
    slate: "from-slate-50 dark:from-slate-950/30",
    violet: "from-violet-50 dark:from-violet-950/30",
  };

  return (
    <div className="space-y-6">
      <div className={`${accentGradients[accent] || accentGradients.blue} via-white dark:via-white/[0.02] to-white dark:to-white/[0.02] rounded-2xl p-6 sm:p-8 border border-gray-200/60 dark:border-white/[0.06]`}>
        <div className="flex items-center gap-4">
          <Skeleton variant="shimmer" className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton variant="shimmer" className="h-6 w-40" />
            <Skeleton variant="shimmer" className="h-3 w-56" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <Skeleton variant="shimmer" className="w-10 h-10 rounded-xl" />
              <Skeleton variant="shimmer" className="h-4 w-10 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="shimmer" className="h-6 w-16" />
              <Skeleton variant="shimmer" className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] flex flex-col items-center gap-2.5 shadow-sm">
            <Skeleton variant="shimmer" className="w-8 h-8 rounded-lg" />
            <Skeleton variant="shimmer" className="h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-6 space-y-4 shadow-sm">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton variant="shimmer" className="h-5 w-32" />
                <Skeleton variant="shimmer" className="h-3 w-24" />
              </div>
              <Skeleton variant="shimmer" className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex items-end gap-1.5 h-44">
              {[45, 62, 38, 75, 55, 80, 42, 68, 50, 72, 58, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-end justify-end">
                  <Skeleton variant="shimmer" className="w-full rounded-t-md" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-6 space-y-4 shadow-sm">
            <Skeleton variant="shimmer" className="h-5 w-36" />
            <div className="flex items-center gap-6">
              <Skeleton variant="shimmer" className="w-28 h-28 rounded-full shrink-0" />
              <div className="space-y-3 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton variant="shimmer" className="w-3 h-3 rounded-full shrink-0" />
                    <Skeleton variant="shimmer" className="h-3 w-16" />
                    <Skeleton variant="shimmer" className="h-3 w-8 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <Skeleton variant="shimmer" className="h-5 w-32" />
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-6 py-3.5 flex items-center gap-3">
                  <Skeleton variant="shimmer" className="w-9 h-9 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton variant="shimmer" className="h-4 w-28" />
                    <Skeleton variant="shimmer" className="h-3 w-40" />
                  </div>
                  <Skeleton variant="shimmer" className="h-3 w-14 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[90vh] flex items-center bg-gradient-to-br from-blue-950/40 via-base-100 to-blue-950/20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <Skeleton variant="shimmer" className="h-8 w-40 rounded-full" />
            <div className="space-y-3">
              <Skeleton variant="shimmer" className="h-12 w-full" />
              <Skeleton variant="shimmer" className="h-12 w-3/4" />
            </div>
            <Skeleton variant="shimmer" className="h-5 w-full" />
            <Skeleton variant="shimmer" className="h-5 w-2/3" />
            <div className="flex gap-4 pt-2">
              <Skeleton variant="shimmer" className="h-12 w-36 rounded-xl" />
              <Skeleton variant="shimmer" className="h-12 w-36 rounded-xl" />
            </div>
            <div className="flex gap-8 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="shimmer" className="h-7 w-16" />
                  <Skeleton variant="shimmer" className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto lg:mx-0 w-full max-w-lg">
            <Skeleton variant="shimmer" className="h-[400px] sm:h-[480px] lg:h-[560px] rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="py-20 sm:py-28 bg-base-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Skeleton variant="shimmer" className="h-[380px] sm:h-[440px] lg:h-[520px] rounded-3xl order-2 lg:order-1" />
          <div className="space-y-5 order-1 lg:order-2">
            <Skeleton variant="shimmer" className="h-8 w-28 rounded-full" />
            <div className="space-y-3">
              <Skeleton variant="shimmer" className="h-10 w-full" />
              <Skeleton variant="shimmer" className="h-10 w-2/3" />
            </div>
            <Skeleton variant="shimmer" className="h-5 w-full" />
            <Skeleton variant="shimmer" className="h-5 w-4/5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-base-200/40">
                  <Skeleton variant="shimmer" className="w-11 h-11 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="shimmer" className="h-4 w-24" />
                    <Skeleton variant="shimmer" className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <div className="py-20 sm:py-28 bg-base-200/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <Skeleton variant="shimmer" className="h-8 w-32 rounded-full mx-auto" />
          <Skeleton variant="shimmer" className="h-10 w-80 mx-auto" />
          <Skeleton variant="shimmer" className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 sm:p-7 rounded-2xl bg-base-200/40 border border-base-300/30 space-y-4">
              <Skeleton variant="shimmer" className="w-14 h-14 rounded-2xl" />
              <Skeleton variant="shimmer" className="h-5 w-32" />
              <div className="space-y-2">
                <Skeleton variant="shimmer" className="h-3 w-full" />
                <Skeleton variant="shimmer" className="h-3 w-4/5" />
              </div>
              <Skeleton variant="shimmer" className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
