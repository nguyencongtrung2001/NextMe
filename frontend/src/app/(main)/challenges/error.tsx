"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ChallengesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Challenges Route Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 shadow-sm border border-rose-200 dark:border-rose-800">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold font-serif text-ink mb-2 text-center">
        Đã xảy ra lỗi hệ thống
      </h2>
      <p className="text-ink-3 dark:text-ink-4 text-center max-w-md mb-6">
        Rất tiếc, chúng tôi không thể tải dữ liệu thử thách lúc này. Hãy thử tải lại trang hoặc quay về trang chủ.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-soft transition-colors shadow-sm"
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="px-6 py-2 border border-border bg-surface hover:bg-surface-2 text-ink-2 font-medium rounded-xl transition-colors shadow-sm"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
