import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] flex-1 px-6 text-center gap-6 w-full animate-fade-up">
      <div className="w-16 h-16 rounded-full bg-rose-bg border border-rose-border flex items-center justify-center text-3xl shadow-sm animate-float">
        🥀
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">
          404 - Không tìm thấy trang
        </h1>
        <p className="text-sm text-ink-3 dark:text-ink-4 max-w-[460px] leading-relaxed">
          Hạt giống bạn đang tìm kiếm có vẻ đã bị thất lạc hoặc đường dẫn này chưa được mở khóa trong vườn.
        </p>
      </div>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md cursor-pointer">
          <MoveLeft className="w-4 h-4 mr-2 inline" />
          <span>Quay lại trang chủ</span>
        </Button>
      </Link>
    </div>
  );
}
