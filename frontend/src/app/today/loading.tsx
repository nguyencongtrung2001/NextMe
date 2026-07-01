export default function Loading() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1 animate-fade-up">
      {/* Header placeholder */}
      <div className="flex flex-col gap-2 w-48">
        <div className="h-4 w-24 bg-surface-3 rounded animate-pulse" />
        <div className="h-8 w-44 bg-surface-3 rounded animate-pulse" />
        <div className="h-3.5 w-32 bg-surface-3 rounded animate-pulse" />
      </div>

      {/* Progress Summary Card placeholder */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <div className="h-5 w-40 bg-surface-3 rounded animate-pulse" />
          <div className="h-4 w-60 bg-surface-3 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="h-10 w-16 bg-surface-3 rounded animate-pulse" />
          <div className="w-20 h-2 bg-surface-3 rounded-full animate-pulse" />
        </div>
      </div>

      {/* List placeholder */}
      <div className="flex flex-col gap-4">
        <div className="h-6 w-36 bg-surface-3 rounded animate-pulse" />
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-border rounded-2xl p-6 bg-card flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-surface-3 animate-pulse shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2">
                    <div className="h-4 w-20 bg-surface-3 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-surface-3 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-2/3 bg-surface-3 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
