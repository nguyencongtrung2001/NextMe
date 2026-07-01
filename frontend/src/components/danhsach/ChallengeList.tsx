"use client";

import { useState, useEffect } from "react";
import { Sprout, Loader2 } from "lucide-react";
import ChallengeCard, { Challenge } from "./ChallengeCard";
import CreateChallengeDialog from "./CreateChallengeDialog";

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // 1. Seed Mock Data if empty
    if (!localStorage.getItem("challenges_data")) {
      const mockChallenges: Challenge[] = [
        {
          id: "c1",
          title: "Dậy sớm lúc 5:30 AM mỗi ngày",
          status: "active",
          totalDays: 66,
          completedDaysCount: 23,
          streak: 23,
          progress: 35,
          startDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedEndDate: new Date(Date.now() + 43 * 24 * 60 * 60 * 1000).toISOString(),
          flower: {
            name: "Hướng Dương",
            type: "sunflower",
            color: "var(--amber)",
            emoji: "🌻",
          },
        },
        {
          id: "c2",
          title: "Đọc 10 trang sách",
          status: "completed",
          totalDays: 30,
          completedDaysCount: 30,
          streak: 30,
          progress: 100,
          startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedEndDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          flower: {
            name: "Tulip",
            type: "tulip",
            color: "var(--rose)",
            emoji: "🌷",
          },
        },
        {
          id: "c3",
          title: "Luyện tập Yoga 15 phút",
          status: "active",
          totalDays: 30,
          completedDaysCount: 9,
          streak: 9,
          progress: 30,
          startDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          flower: {
            name: "Tulip",
            type: "tulip",
            color: "var(--rose)",
            emoji: "🌷",
          },
        },
      ];
      localStorage.setItem("challenges_data", JSON.stringify(mockChallenges));
    }

    if (!localStorage.getItem("challenges_logs")) {
      const c1Logs = Array.from({ length: 23 }, (_, i) => ({
        id: `log-c1-${i + 1}`,
        day: i + 1,
        date: new Date(Date.now() - (23 - i) * 24 * 60 * 60 * 1000).toISOString(),
        mood: "🔥 Cực sung",
        note: `Tôi đã dậy sớm và hoàn thành tốt ngày thứ ${i + 1} của mình!`,
        media: [],
      }));

      const c3Logs = Array.from({ length: 9 }, (_, i) => ({
        id: `log-c3-${i + 1}`,
        day: i + 1,
        date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
        mood: "✨ Tuyệt vời",
        note: `Hôm nay luyện tập Yoga ngày thứ ${i + 1} thật sảng khoái và thư thái.`,
        media: [],
      }));

      const mockLogs = {
        c1: c1Logs,
        c3: c3Logs,
      };
      localStorage.setItem("challenges_logs", JSON.stringify(mockLogs));
    }

    // 2. Fetch state
    const data = JSON.parse(localStorage.getItem("challenges_data") || "[]");
    const timer = setTimeout(() => {
      setChallenges(data);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateChallenge = (
    title: string,
    days: number,
    flower: "sunflower" | "lavender" | "tulip"
  ) => {
    let flowerName = "Hướng Dương";
    let flowerEmoji = "🌻";
    let flowerColor = "var(--primary)";

    if (flower === "lavender") {
      flowerName = "Hoa Oải Hương";
      flowerEmoji = "🪻";
      flowerColor = "var(--sage)";
    } else if (flower === "tulip") {
      flowerName = "Hoa Tulip";
      flowerEmoji = "🌷";
      flowerColor = "var(--rose)";
    }

    const newChallenge: Challenge = {
      id: `c-${Date.now()}`,
      title: title,
      status: "active",
      totalDays: days,
      completedDaysCount: 0,
      streak: 0,
      progress: 0,
      startDate: new Date().toISOString(),
      estimatedEndDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      flower: {
        name: flowerName,
        type: flower,
        color: flowerColor,
        emoji: flowerEmoji,
      },
    };

    const updatedChallenges = [newChallenge, ...challenges];
    setChallenges(updatedChallenges);
    localStorage.setItem("challenges_data", JSON.stringify(updatedChallenges));
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* Header section (retaining create dialog button) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">
            Thử thách của bạn
          </h1>
          <p className="text-ink-3 dark:text-ink-4 text-sm md:text-base mt-1">
            Nơi quản lý tất cả các thói quen cam kết của bạn.
          </p>
        </div>

        <CreateChallengeDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreate={handleCreateChallenge}
        />
      </div>

      {/* Challenges Grid list */}
      {!isLoaded ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-3 dark:text-ink-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Đang tải danh sách thử thách...</p>
        </div>
      ) : challenges.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card p-12 text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-primary border border-border">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">Không tìm thấy thử thách</h3>
            <p className="text-sm text-ink-4 mt-1">Bạn chưa gieo hạt giống nào. Hãy bắt đầu bằng cách tạo thử thách mới!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {challenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      )}
    </div>
  );
}
