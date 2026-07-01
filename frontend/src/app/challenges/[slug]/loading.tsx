
export default function Loading() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1 animate-fade-up">
      {/* Back link placeholder */}
      <div className="h-4 w-32 bg-surface-3 rounded animate-pulse" />

      {/* Banner placeholder */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 w-full">
          <div className="w-14 h-14 rounded-full bg-surface-3 shrink-0 animate-pulse" />
          <div className="flex flex-col gap-2 w-full max-w-md">
            <div className="h-4 w-24 bg-surface-3 rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-surface-3 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-surface-3 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-36 bg-surface-3 rounded-full hidden sm:block animate-pulse" />
      </div>

      {/* Main layout placeholder */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <div className="h-5 w-48 bg-surface-3 rounded animate-pulse" />
            <div className="h-3.5 w-64 bg-surface-3 rounded animate-pulse" />
          </div>
          <div className="h-5 w-32 bg-surface-3 rounded animate-pulse" />
        </div>

        {/* Heatmap Grid placeholders */}
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-12 gap-2 mt-2">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-surface-3 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
