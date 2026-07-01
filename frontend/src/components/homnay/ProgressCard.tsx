interface ProgressCardProps {
  completedCount: number;
  totalActive: number;
  completionPct: number;
}

export default function ProgressCard({
  completedCount,
  totalActive,
  completionPct,
}: ProgressCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-base md:text-lg font-bold text-ink">Tiến độ hoàn thành</h3>
        <p className="text-ink-3 dark:text-ink-4 text-sm">
          Đã hoàn thành <strong className="text-primary">{completedCount}</strong> trên{" "}
          <strong>{totalActive}</strong> thử thách của hôm nay.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-2xl font-extrabold text-primary font-mono">{completionPct}%</span>
          <div className="text-[10px] tracking-wider uppercase font-bold text-ink-4">Hoàn thành</div>
        </div>
        <div className="w-20 h-2 bg-surface-3 rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
