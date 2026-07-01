"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Today dashboard error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] flex-1 px-6 text-center gap-6 w-full animate-fade-up">
      <div className="w-16 h-16 rounded-full bg-rose-bg border border-rose-border flex items-center justify-center text-3xl shadow-sm animate-pulse">
        <AlertCircle className="w-8 h-8 text-[#E58C7C]" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-serif text-3xl font-bold text-ink tracking-tight">
          Đã xảy ra sự cố!
        </h1>
        <p className="text-sm text-ink-3 dark:text-ink-4 max-w-[460px] leading-relaxed">
          Đã xảy ra lỗi khi tải danh sách nhiệm vụ hôm nay. Vui lòng thử lại.
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Thử lại lần nữa
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="rounded-xl h-11 border border-border bg-transparent hover:bg-surface-3 text-ink-2 dark:text-ink-3 hover:text-ink transition-all duration-200 px-6 cursor-pointer"
        >
          Tải lại trang
        </Button>
      </div>
    </div>
  );
}
