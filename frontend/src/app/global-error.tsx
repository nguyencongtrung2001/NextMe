"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root critical error caught:", error);
  }, [error]);

  return (
    <html lang="vi" className="h-full">
      <body className="h-full bg-[#FFFDFB] text-[#1C1917] flex flex-col items-center justify-center p-6 text-center gap-6 font-sans">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-3xl text-rose-500 shadow-sm animate-bounce">
          <AlertTriangle className="w-8 h-8 text-[#E58C7C]" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-serif text-3xl font-bold text-[#1C1917] tracking-tight">
            Lỗi Hệ Thống Nghiêm Trọng
          </h1>
          <p className="text-sm text-[#6B5F59] max-w-[460px] leading-relaxed">
            Đã xảy ra lỗi nghiêm trọng ở cấp độ ứng dụng. Vui lòng khôi phục phiên hoạt động hoặc thử lại.
          </p>
        </div>
        <Button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-soft text-white font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2 inline" />
          Khôi phục ứng dụng
        </Button>
      </body>
    </html>
  );
}
