"use client";

import { Loader2 } from "lucide-react";

export default function GardenLoading() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 flex-1 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="w-28 h-4 bg-muted rounded" />
        <div className="w-48 h-8 bg-muted rounded" />
        <div className="w-72 h-4 bg-muted rounded mt-1" />
      </div>

      {/* Garden Board Skeleton */}
      <div className="h-[400px] w-full bg-muted/30 border border-border/50 rounded-3xl flex items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs text-ink-4 font-bold uppercase tracking-wider">Đang khởi tạo vườn hoa...</span>
        </div>
      </div>

      {/* Grid Seedlings Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="w-36 h-6 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-20 bg-muted/30 border border-border/50 rounded-2xl" />
          <div className="h-20 bg-muted/30 border border-border/50 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
