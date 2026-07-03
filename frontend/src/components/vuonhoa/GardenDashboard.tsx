"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Flower, Compass, Sprout, Calendar, Flame, Info } from "lucide-react";
import { layDanhSachThuThach, Challenge as BackendChallenge } from "@/api/thu_thach";
import { slugifyText } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FlowerInfo {
  name: string;
  type: string;
  color: string;
  emoji: string;
}

interface Challenge {
  id: string;
  title: string;
  status: "active" | "completed";
  totalDays: number;
  completedDaysCount: number;
  streak: number;
  progress: number;
  startDate: string;
  estimatedEndDate: string;
  flower: FlowerInfo;
}

const styles = `
  @keyframes sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }
  .animate-sway {
    animation: sway 4s ease-in-out infinite;
    transform-origin: bottom center;
  }
  .animate-sway-delayed {
    animation: sway 5.5s ease-in-out infinite;
    animation-delay: 0.8s;
    transform-origin: bottom center;
  }
`;

// Hàm tạo vị trí ngẫu nhiên cố định dựa trên ID của thử thách
function getDeterministicCoords(id: string, idx: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const left = 8 + Math.abs((hash + idx * 11) % 84); // 8% -> 92%
  const top = 25 + Math.abs((hash * 7 + idx * 19) % 55); // 25% -> 80%
  return { left, top };
}

export default function GardenDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFlower, setActiveFlower] = useState<Challenge | null>(null);

  useEffect(() => {
    layDanhSachThuThach()
      .then((res) => {
        if (res.success && res.data) {
          const mapped: Challenge[] = res.data.map((c: BackendChallenge) => ({
            id: c.id,
            title: c.title,
            status: c.status.toLowerCase() as "active" | "completed",
            totalDays: c.totalDays,
            completedDaysCount: c.completedDaysCount,
            streak: c.streak,
            progress: c.progress,
            startDate: c.startDate,
            estimatedEndDate: c.estimatedEndDate,
            flower: {
              name: c.flower?.nameFlower || "Hướng Dương",
              type: c.flower?.type || "sunflower",
              color: c.flower?.color || "var(--amber)",
              emoji: c.flower?.emoji || "🌻",
            }
          }));

          setChallenges(mapped);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu vườn hoa:", err);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const completedChallenges = challenges.filter((c) => c.status === "completed");
  const growingChallenges = challenges.filter((c) => c.status === "active");

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-3 dark:text-ink-4 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Đang mở cổng vườn hoa sinh thái...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10 w-full animate-fade-up">
      <style>{styles}</style>

      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Flower className="w-3.5 h-3.5" />
          <span>Vườn sinh thái của bạn</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">Khu vườn</h1>
        <p className="text-ink-4 text-xs italic font-medium">
          Mỗi thử thách gieo hạt hoàn thành sẽ nở một bông hoa đung đưa rực rỡ tại đây.
        </p>
      </div>

      {/* Main lawn panel */}
      <div className="relative border border-emerald-900/10 dark:border-emerald-500/10 rounded-3xl overflow-hidden shadow-inner bg-gradient-to-b from-emerald-50/50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 p-6 md:p-8 flex flex-col gap-6 min-h-[460px]">
        {/* Sky/Atmosphere visual details */}
        <div className="absolute top-4 right-6 flex items-center gap-2 text-xxs uppercase font-extrabold tracking-widest text-emerald-800/40 dark:text-emerald-400/40">
          <Compass className="w-3.5 h-3.5" />
          <span>Vườn sinh thái tự nhiên</span>
        </div>

        {/* Grass ground plot */}
        <div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-t from-emerald-700/10 to-transparent dark:from-emerald-400/5 pointer-events-none" />

        {completedChallenges.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 select-none my-auto">
            <div className="w-14 h-14 rounded-full bg-white dark:bg-stone-850 flex items-center justify-center text-emerald-600/50 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
              <Sprout className="w-7 h-7" />
            </div>
            <div className="max-w-md">
              <h3 className="font-serif text-base font-bold text-emerald-900/70 dark:text-emerald-100/70">
                Khu đất đang chờ gieo hạt
              </h3>
              <p className="text-xs text-emerald-800/50 dark:text-emerald-300/40 mt-1 leading-relaxed">
                Chưa có bông hoa nào nở trong vườn của bạn. Hãy hoàn thành trọn vẹn bất kỳ thử thách nào của bạn để gieo trồng bông hoa đầu tiên nhé!
              </p>
            </div>
            <Link href="/challenges">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm">
                Đi đến Thử thách
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 relative w-full h-[320px] border border-emerald-950/5 dark:border-emerald-500/5 rounded-2xl bg-gradient-to-b from-white/40 to-white/70 dark:from-stone-900/30 dark:to-stone-900/50 backdrop-blur-[2px]">
            {/* Render deterministic flowers */}
            {completedChallenges.map((c, idx) => {
              const { left, top } = getDeterministicCoords(c.id, idx);
              const isSelected = activeFlower?.id === c.id;

              return (
                <div
                  key={c.id}
                  className="absolute cursor-pointer flex flex-col items-center select-none group"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                  onClick={() => setActiveFlower(isSelected ? null : c)}
                >
                  {/* Flower Emoji & animation */}
                  <div
                    className={cn(
                      "w-12 h-12 flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-115",
                      idx % 2 === 0 ? "animate-sway" : "animate-sway-delayed"
                    )}
                  >
                    {c.flower.emoji}
                  </div>

                  {/* Little green stem */}
                  <div className="w-1 h-8 bg-emerald-600/60 dark:bg-emerald-500/40 rounded-full -mt-1 group-hover:bg-emerald-600 transition-colors" />

                  {/* Detached shadow */}
                  <div className="w-3 h-0.5 bg-black/10 dark:bg-white/5 rounded-full filter blur-[0.5px]" />

                  {/* Active selection dot indicator */}
                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 animate-ping" />
                  )}
                </div>
              );
            })}

            {/* Float Tooltip Details card */}
            {activeFlower && (
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-card/95 border border-border p-4 rounded-2xl shadow-xl backdrop-blur-md animate-fade-up z-20 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeFlower.flower.emoji}</span>
                    <div>
                      <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                        {activeFlower.flower.name}
                      </h4>
                      <p className="text-[10px] text-ink-4">Đã trồng vĩnh viễn</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveFlower(null)}
                    className="p-1 text-ink-4 hover:text-ink hover:bg-surface-3 rounded-full transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="border-t border-black/5 dark:border-white/5 pt-2 flex flex-col gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-ink leading-tight">
                    {activeFlower.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xxs font-bold text-ink-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      {activeFlower.totalDays} ngày
                    </span>
                    {activeFlower.streak > 0 && (
                      <span className="flex items-center gap-1 text-primary">
                        <Flame className="w-3 h-3 animate-pulse" />
                        {activeFlower.streak} ngày
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/challenges/${slugifyText(activeFlower.title)}-${activeFlower.id}`}
                  className="inline-flex justify-center items-center py-1.5 text-center rounded-lg bg-surface border border-border hover:bg-surface-3 text-xs font-bold text-ink-2 transition-colors cursor-pointer"
                >
                  Xem chi tiết nhật ký
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seedling / Growing nursery section */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span>Khu ươm mầm giống ({growingChallenges.length})</span>
        </h3>

        {growingChallenges.length === 0 ? (
          <p className="text-xs text-ink-4 italic bg-surface-2 dark:bg-stone-850 p-4 rounded-xl border border-border">
            Không có hạt giống nào đang trong quá trình gieo lớn. Hãy tạo một thử thách mới để bắt đầu ươm trồng!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {growingChallenges.map((c) => {
              let seedlingClass = "bg-amber-500/10 border-amber-500/20";
              if (c.flower.type === "lavender") seedlingClass = "bg-purple-500/10 border-purple-500/20";
              else if (c.flower.type === "tulip") seedlingClass = "bg-rose-500/10 border-rose-500/20";

              return (
                <div
                  key={c.id}
                  className={cn(
                    "border rounded-2xl p-4 flex gap-4 items-center bg-card shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-transform hover:-translate-y-0.5",
                    seedlingClass
                  )}
                >
                  {/* Floating seed emoji */}
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center text-2xl border border-black/5 shrink-0 shadow-sm animate-float">
                    🌱
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-ink leading-tight truncate">
                        {c.title}
                      </h4>
                      <span className="text-xxs font-extrabold text-primary shrink-0">
                        {c.progress}%
                      </span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-ink-4 flex items-center justify-between">
                      <span>Loài hoa: <strong>{c.flower.name}</strong></span>
                      <span>
                        Tiến độ: <strong>{c.completedDaysCount}/{c.totalDays} ngày</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
