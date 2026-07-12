import { Container } from "../ui";

function HubSkeleton() {
  return (
    <>
      <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-cyan-950/40 via-base-100 to-emerald-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
        </div>
        <Container className="relative z-10 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="h-8 w-44 rounded-full bg-white/10 skeleton-shimmer" />
            <div className="h-14 w-full rounded-xl bg-white/10 skeleton-shimmer" />
            <div className="h-14 w-3/4 rounded-xl bg-white/10 skeleton-shimmer" />
            <div className="h-5 w-full rounded-lg bg-white/10 skeleton-shimmer" />
            <div className="h-5 w-4/5 rounded-lg bg-white/10 skeleton-shimmer" />
          </div>
        </Container>
      </div>

      <div className="py-20 sm:py-28">
        <Container>
          <div className="text-center mb-14 space-y-3">
            <div className="h-8 w-36 rounded-full bg-white/10 skeleton-shimmer mx-auto" />
            <div className="h-10 w-72 rounded-xl bg-white/10 skeleton-shimmer mx-auto" />
            <div className="h-5 w-96 rounded-lg bg-white/10 skeleton-shimmer mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 skeleton-shimmer" />
                  <div className="h-5 w-32 rounded-lg bg-white/10 skeleton-shimmer" />
                  <div className="h-4 w-full rounded-lg bg-white/10 skeleton-shimmer" />
                  <div className="h-4 w-4/5 rounded-lg bg-white/10 skeleton-shimmer" />
                  <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}

function ToolPageSkeleton() {
  return (
    <>
      <div className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-cyan-950/40 via-base-100 to-teal-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
        </div>
        <Container className="relative z-10 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="h-5 w-32 rounded-lg bg-white/10 skeleton-shimmer" />
            <div className="h-8 w-44 rounded-full bg-white/10 skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
            <div className="h-12 w-3/4 rounded-xl bg-white/10 skeleton-shimmer" />
            <div className="h-5 w-full rounded-lg bg-white/10 skeleton-shimmer" />
          </div>
        </Container>
      </div>

      <div className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 sm:p-8 space-y-5">
                <div className="h-6 w-40 rounded-lg bg-white/10 skeleton-shimmer" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 rounded bg-white/10 skeleton-shimmer" />
                      <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
                    </div>
                  ))}
                </div>
                <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-4">
                <div className="h-6 w-32 rounded-lg bg-white/10 skeleton-shimmer" />
                <div className="h-32 w-full rounded-xl bg-white/10 skeleton-shimmer" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export { HubSkeleton, ToolPageSkeleton };
