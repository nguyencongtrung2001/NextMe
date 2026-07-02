"use client";

import { useState, useEffect } from "react";
import { Sprout, Loader2 } from "lucide-react";
import ChallengeCard, { Challenge } from "./ChallengeCard";
import CreateChallengeDialog from "./CreateChallengeDialog";
import { layDanhSachThuThach, taoThuThach, Challenge as BackendChallenge } from "@/api/thu_thach";

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;

    layDanhSachThuThach()
      .then((response) => {
        if (!active) return;
        if (response.success) {
          // Ánh xạ dữ liệu từ backend sang định dạng frontend hiện tại
          const mappedChallenges: Challenge[] = response.data.map((c: BackendChallenge) => ({
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
          setChallenges(mappedChallenges);
        } else {
          setErrorMsg("Không thể tải danh sách thử thách");
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        const error = err as Error;
        setErrorMsg(error.message || "Không thể tải danh sách thử thách");
      })
      .finally(() => {
        if (!active) return;
        setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleCreateChallenge = async (
    title: string,
    days: number,
    flower: "sunflower" | "lavender" | "tulip"
  ) => {
    try {
      const response = await taoThuThach({
        title,
        totalDays: days,
        flowerType: flower
      });

      if (response.success && response.data) {
        const c: BackendChallenge = response.data;
        const mappedNewChallenge: Challenge = {
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
        };
        setChallenges((prev) => [mappedNewChallenge, ...prev]);
        setIsDialogOpen(false);
      } else {
        alert(response.message || "Lỗi khi tạo thử thách");
      }
    } catch (err) {
      console.error(err);
      const error = err as Error;
      alert(error.message || "Có lỗi xảy ra khi tạo thử thách");
    }
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

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

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
