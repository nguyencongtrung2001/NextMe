"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GardenErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GardenError({ error, reset }: GardenErrorProps) {
  useEffect(() => {
    console.error("Lỗi trang vườn hoa:", error);
  }, [error]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 flex flex-col items-center justify-center gap-5 text-center flex-1">
      <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 border border-rose-100 dark:border-rose-900/30 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-md">
        <h2 className="font-serif text-xl font-bold text-ink">Đã có lỗi xảy ra</h2>
        <p className="text-xs text-ink-4 leading-relaxed">
          Không thể tải dữ liệu vườn hoa sinh thái của bạn vào lúc này. Vui lòng kiểm tra kết nối mạng và thử lại.
        </p>
      </div>

      <Button
        onClick={() => reset()}
        className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all duration-200 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Thử tải lại vườn hoa</span>
      </Button>
    </div>
  );
}
