import { Loader2, Sprout } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] flex-1 gap-4 w-full animate-fade-up">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
        <Sprout className="w-8 h-8 text-primary absolute animate-bounce" />
      </div>
      <div className="flex flex-col items-center text-center gap-1">
        <h3 className="font-serif text-lg font-bold text-ink">Đang gieo trồng...</h3>
        <p className="text-xs text-ink-4">Vui lòng chờ trong giây lát để tải dữ liệu.</p>
      </div>
    </div>
  );
}
