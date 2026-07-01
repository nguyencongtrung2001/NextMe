import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Flower {
  name: string;
  type: "sunflower" | "lavender" | "tulip";
  color: string;
  emoji: string;
}

export interface Challenge {
  id: string;
  title: string;
  status: "active" | "completed";
  totalDays: number;
  completedDaysCount: number;
  streak: number;
  progress: number;
  startDate: string;
  estimatedEndDate: string;
  flower: Flower;
}

export interface Log {
  id: string;
  day: number;
  date: string;
  mood: string;
  note: string;
  media: { type: "image" | "video"; url: string }[];
}

interface TodayCardProps {
  challenge: Challenge;
  todayLog?: Log;
  currentDay: number;
}

export default function TodayCard({ challenge, todayLog, currentDay }: TodayCardProps) {
  const completed = !!todayLog;

  let flowerClass = "bg-amber-100";
  if (challenge.flower.type === "lavender") flowerClass = "bg-slate-100 dark:bg-stone-850";
  else if (challenge.flower.type === "tulip") flowerClass = "bg-rose-100";

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <article
        className={cn(
          "group rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 hover:shadow-md bg-card cursor-pointer border",
          completed
            ? "border-sage-border/50 bg-sage-bg/30 hover:border-sage-border"
            : "border-border hover:border-primary/30"
        )}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg border border-black/5 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105",
              flowerClass
            )}
          >
            {challenge.flower.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-sm md:text-base font-bold text-ink leading-tight truncate group-hover:text-primary transition-colors">
              {challenge.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-ink-4 font-medium">
                Ngày {currentDay}/{challenge.totalDays}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            {completed ? (
              <span className="inline-flex items-center px-2 py-1 rounded bg-sage/15 text-sage text-[10px] font-bold uppercase tracking-wider">
                Đã làm
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded bg-surface-3 text-ink-3 dark:text-ink-4 text-[10px] font-bold uppercase tracking-wider">
                Chưa làm
              </span>
            )}
          </div>
        </div>

        {completed && todayLog && (
          <div className="ml-[54px] pt-1">
            <div className="bg-surface/50 dark:bg-black/20 rounded-lg p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <span className="text-xs bg-surface dark:bg-stone-800 px-1.5 py-0.5 rounded shadow-sm border border-border/50 shrink-0">
                  {todayLog.mood}
                </span>
                <p className="text-xs text-ink-2 dark:text-ink-3 italic flex-1 leading-relaxed mt-0.5">
                  &ldquo;{todayLog.note || "Không có ghi chú"}&rdquo;
                </p>
              </div>

              {todayLog.media && todayLog.media.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                  {todayLog.media.map((m, idx) => (
                    <div key={idx} className="w-12 h-12 relative rounded-md overflow-hidden border border-border/50 shrink-0 shadow-sm">
                      {m.type === "image" ? (
                        <Image src={m.url} alt="logged media" fill className="object-cover" unoptimized />
                      ) : (
                        <video src={m.url} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
