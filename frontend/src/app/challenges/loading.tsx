import { Loader2 } from "lucide-react";

export default function ChallengesLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm animate-pulse border border-primary/20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold font-serif text-ink mb-2">
        Đang tải thử thách...
      </h2>
      <p className="text-ink-3 dark:text-ink-4 text-center max-w-md">
        Vui lòng đợi trong giây lát trong khi chúng tôi tải danh sách khu vườn của bạn.
      </p>
    </div>
  );
}
