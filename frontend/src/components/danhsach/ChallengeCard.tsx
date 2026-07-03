import Link from "next/link";
import { cn, slugifyText } from "@/lib/utils";

export interface Flower {
  name: string;
  type: string;
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

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const isCompleted = challenge.status === "completed";

  let flowerClass = "bg-amber-100";
  if (challenge.flower.type === "lavender") flowerClass = "bg-slate-100 dark:bg-stone-850";
  else if (challenge.flower.type === "tulip") flowerClass = "bg-rose-100";

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Link
      href={`/challenges/${slugifyText(challenge.title)}-${challenge.id}`}
      className={cn(
        "group block bg-card border rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md",
        isCompleted
          ? "border-sage-border/50 bg-sage-bg/30 hover:border-sage-border"
          : "border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center text-xl border border-black/5 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105",
            flowerClass
          )}
        >
          {challenge.flower.emoji}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-sm md:text-base font-bold text-ink leading-tight truncate group-hover:text-primary transition-colors duration-200">
              {challenge.title}
            </h3>
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0",
                isCompleted
                  ? "bg-sage/15 text-sage"
                  : "bg-surface-3 text-ink-3 dark:text-ink-4"
              )}
            >
              {isCompleted ? "Hoàn thành" : "Đang chạy"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center mt-0.5">
            {challenge.streak > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded shadow-sm border border-primary/10">
                🔥 {challenge.streak} ngày streak
              </span>
            )}
            <span className="text-xs text-ink-4 font-medium">
              {formatDate(challenge.startDate)} — {formatDate(challenge.estimatedEndDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-ink-4 ml-[60px]">
        <span>Hạt giống</span>
        <span className="text-primary">{challenge.flower.name}</span>
      </div>
    </Link>
  );
}
