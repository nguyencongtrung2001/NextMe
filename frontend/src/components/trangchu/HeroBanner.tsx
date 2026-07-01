import Link from "next/link";
import { Sprout, CalendarDays, Layers } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-10 flex flex-col items-center text-center gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden w-full transition-all duration-300 hover:shadow-md">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(232,131,61,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(124,159,128,0.04)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-primary border border-border shadow-sm relative z-10 hover:rotate-12 transition-transform duration-300">
        <Layers className="w-5 h-5" />
      </div>
      
      <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight max-w-2xl relative z-10 leading-tight">
        Trồng Hoa Hành Trình Của Bạn
      </h1>
      
      <p className="text-ink-3 dark:text-ink-4 text-sm md:text-base max-w-[500px] leading-relaxed relative z-10">
        Thiết lập các thói quen tích cực, vượt qua thử thách mỗi ngày và ngắm nhìn khu vườn tâm hồn của bạn nở rộ rực rỡ.
      </p>
      
      <div className="flex flex-wrap gap-4 mt-2 justify-center relative z-10">
        <Link
          href="/challenges"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary-soft text-primary-foreground shadow-[0_4px_12px_rgba(232,131,61,0.25)] hover:shadow-[0_6px_16px_rgba(232,131,61,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
        >
          <Sprout className="w-4 h-4" />
          <span>Bắt đầu ngay</span>
        </Link>
        <Link
          href="/today"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold border border-border bg-transparent hover:bg-surface-3 text-ink-2 dark:text-ink-3 hover:text-ink dark:hover:text-ink transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
        >
          <CalendarDays className="w-4 h-4" />
          <span>Nhiệm vụ hôm nay</span>
        </Link>
      </div>
    </div>
  );
}
