"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { layDanhSachThuThach, Challenge as BackendChallenge, Log as BackendLog, MediaFile as BackendMediaFile } from "@/api/thu_thach";
import { getLocalTodayString } from "@/lib/utils";
import ProgressCard from "./ProgressCard";
import TodayCard, { Challenge } from "./TodayCard";

function calcCurrentDay(startDateStr: string, totalDays: number) {
  const start = new Date(startDateStr);
  const now = new Date();
  
  // Thiết lập mốc Midnight để tính toán khoảng cách ngày thuần túy, tránh lệch múi giờ
  const startZero = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = nowZero.getTime() - startZero.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 0;
  return Math.min(diffDays + 1, totalDays);
}

const getBannerDateString = () => {
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const date = new Date();
  return `${days[date.getDay()]} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default function TodayDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dateString] = useState(getBannerDateString);

  useEffect(() => {
    // 1. Fetch danh sách thử thách từ Backend
    layDanhSachThuThach()
      .then((res) => {
        if (res.success && res.data) {
          // Ánh xạ dữ liệu CSDL sang cấu trúc frontend quy định
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
            },
            historyLogs: c.historyLogs?.map((l: BackendLog) => ({
              id: l.id,
              day: l.day,
              date: l.loggedDate,
              mood: l.mood || "Bình thường",
              note: l.note || "",
              media: l.mediaFiles?.map((m: BackendMediaFile) => ({
                type: m.type.toLowerCase() as "image" | "video",
                url: m.url
              })) || []
            })) || []
          }));

          setChallenges(mapped);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu trang Hôm nay:", err);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const todayStr = getLocalTodayString();
  const activeChallenges = challenges.filter(c => c.status === "active");
  const totalActive = activeChallenges.length;
  
  let completedCount = 0;
  activeChallenges.forEach(c => {
    const hasLogToday = c.historyLogs?.some(l => l.date.split("T")[0] === todayStr);
    if (hasLogToday) completedCount++;
  });

  const completionPct = totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-3 dark:text-ink-4 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Đang tải hành trình hôm nay...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full animate-fade-up">
      {/* Header section */}
      <div className="flex flex-col gap-1">
        <div className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Hành trình hôm nay</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">Hôm nay</h1>
        <p className="text-ink-4 text-xs italic font-medium mt-0.5">{dateString}</p>
      </div>

      {/* Progress Summary Card */}
      <ProgressCard
        completedCount={completedCount}
        totalActive={totalActive}
        completionPct={completionPct}
      />

      {/* Tasks listing */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-ink">Nhiệm vụ của bạn</h3>

        {totalActive === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card p-12 text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-primary border border-border">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Khu vườn đang trống</h3>
              <p className="text-sm text-ink-4 mt-1">
                Không có thử thách nào đang hoạt động hôm nay. Hãy bắt đầu gieo hạt giống ở trang Thử thách!
              </p>
            </div>
            <Link href="/challenges">
              <Button className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer">
                Gieo hạt ngay
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeChallenges.map((c) => {
              const currentDay = calcCurrentDay(c.startDate, c.totalDays);
              const todayLog = c.historyLogs?.find((l) => l.date.split("T")[0] === todayStr);

              return (
                <TodayCard
                  key={c.id}
                  challenge={c}
                  todayLog={todayLog}
                  currentDay={currentDay}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
