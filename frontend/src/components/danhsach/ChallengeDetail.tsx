"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  Flame,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import { cn, getFlowerTheme } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { layChiTietThuThach, guiCheckIn, xoaThuThach, capNhatThuThach, Challenge as BackendChallenge, Log as BackendLog, MediaFile as BackendMediaFile } from "@/api/thu_thach";
import { MOOD_LIST } from "@/constants";
import EditChallengeDialog from "./EditChallengeDialog";
import CheerMascot from "./CheerMascot";

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

export interface Log {
  id: string;
  day: number;
  date: string;
  mood: string;
  note: string;
  media: { type: "image" | "video"; url: string }[];
}

function calcCurrentDay(startDateStr: string, totalDays: number) {
  const start = new Date(startDateStr);
  const now = new Date();
  
  // Thiết lập mốc Midnight để tính toán khoảng cách ngày thuần túy, tránh lệch múi giờ
  const startZero = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = nowZero.getTime() - startZero.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 0; // Chưa bắt đầu
  return Math.min(diffDays + 1, totalDays);
}

function formatDate(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

interface ChallengeDetailProps {
  slug: string;
}



const styles = `
  @keyframes fall {
    0% { transform: translateY(-5vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
  }
  .animate-fall {
    position: fixed;
    top: -5vh;
    animation: fall linear forwards;
    z-index: 9999;
    pointer-events: none;
    border-radius: 50% 0 50% 50%;
  }
`;

export default function ChallengeDetail({ slug }: ChallengeDetailProps) {
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeLogs, setChallengeLogs] = useState<Log[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditChallenge = (title: string, totalDays: number) => {
    if (!challenge) return;
    setIsLoaded(false);
    capNhatThuThach(challenge.id, { title, totalDays })
      .then((res) => {
        if (res.success && res.data) {
          const updated: BackendChallenge = res.data;
          const mapped: Challenge = {
            id: updated.id,
            title: updated.title,
            status: updated.status.toLowerCase() as "active" | "completed",
            totalDays: updated.totalDays,
            completedDaysCount: updated.completedDaysCount,
            streak: updated.streak,
            progress: updated.progress,
            startDate: updated.startDate,
            estimatedEndDate: updated.estimatedEndDate,
            flower: {
              name: updated.flower?.nameFlower || "Hướng Dương",
              type: updated.flower?.type || "sunflower",
              color: updated.flower?.color || "var(--amber)",
              emoji: updated.flower?.emoji || "🌻",
            }
          };
          setChallenge(mapped);
          setIsEditDialogOpen(false);
        } else {
          alert(res.message || "Lỗi khi cập nhật thử thách");
        }
      })
      .catch((err) => {
        console.error(err);
        const error = err as Error;
        alert(error.message || "Lỗi khi cập nhật thử thách");
      })
      .finally(() => {
        setIsLoaded(true);
      });
  };

  const handleDeleteChallenge = () => {
    if (!challenge) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa thử thách "${challenge.title}"? Mọi nhật ký check-in và file ảnh/video liên quan trên Cloudinary sẽ bị xóa vĩnh viễn.`)) {
      setIsLoaded(false);
      xoaThuThach(challenge.id)
        .then((res) => {
          if (res.success) {
            router.push("/challenges");
          } else {
            alert(res.message || "Lỗi khi xóa thử thách");
            setIsLoaded(true);
          }
        })
        .catch((err) => {
          console.error(err);
          const error = err as Error;
          alert(error.message || "Lỗi khi xóa thử thách");
          setIsLoaded(true);
        });
    }
  };

  // Heatmap detail panel selection
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayLog, setSelectedDayLog] = useState<Log | null>(null);

  // Today logger states
  const [selectedMood, setSelectedMood] = useState("Cực sung");
  const [noteText, setNoteText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<{ type: "image" | "video"; url: string }[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

  // Search in timeline
  const [searchQuery, setSearchQuery] = useState("");

  // Confetti particles
  const [petals, setPetals] = useState<{ id: number; left: number; color: string; duration: number; delay: number }[]>([]);

  useEffect(() => {
    let active = true;

    layChiTietThuThach(slug)
      .then((res) => {
        if (!active) return;
        if (res.success && res.data) {
          const data: BackendChallenge = res.data;
          
          // Ánh xạ CSDL backend sang structure frontend
          const mapped: Challenge = {
            id: data.id,
            title: data.title,
            status: data.status.toLowerCase() as "active" | "completed",
            totalDays: data.totalDays,
            completedDaysCount: data.completedDaysCount,
            streak: data.streak,
            progress: data.progress,
            startDate: data.startDate,
            estimatedEndDate: data.estimatedEndDate,
            flower: {
              name: data.flower?.nameFlower || "Hướng Dương",
              type: data.flower?.type || "sunflower",
              color: data.flower?.color || "var(--amber)",
              emoji: data.flower?.emoji || "🌻",
            }
          };

          const mappedLogs: Log[] = data.historyLogs?.map((l: BackendLog) => ({
            id: l.id,
            day: l.day,
            date: l.loggedDate,
            mood: l.mood || "Bình thường",
            note: l.note || "",
            media: l.mediaFiles?.map((m: BackendMediaFile) => ({
              type: m.type.toLowerCase() as "image" | "video",
              url: m.url
            })) || []
          })) || [];

          setChallenge(mapped);
          setChallengeLogs(mappedLogs);

          // Ngày hiện tại
          const todayNum = calcCurrentDay(mapped.startDate, mapped.totalDays);
          setSelectedDay(todayNum);
          const todayLog = mappedLogs.find((l) => l.day === todayNum) || null;
          setSelectedDayLog(todayLog);
        } else {
          setErrorMsg("Không tìm thấy thử thách.");
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        const error = err as Error;
        if (error.message.includes("không tồn tại")) {
          notFound();
        } else {
          setErrorMsg(error.message || "Đã xảy ra lỗi khi tải chi tiết thử thách");
        }
      })
      .finally(() => {
        if (!active) return;
        setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const triggerConfetti = () => {
    const colors = ["#2563EB", "#3B82F6", "#7C9F80", "#E58C7C", "#BFDBFE"];
    const newPetals = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 1.5,
    }));
    setPetals(newPetals);
    setTimeout(() => {
      setPetals([]);
    }, 6000);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setRawFiles((prev) => [...prev, ...files]);

    const newMedia = files.map((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? ("video" as const) : ("image" as const);
      return { type, url };
    });
    setMediaFiles((prev) => [...prev, ...newMedia]);
  };

  const removeMediaFile = (idx: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
    setRawFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCompleteToday = () => {
    if (!challenge) return;

    // Chuẩn bị FormData để upload media files lên Cloudinary
    const formData = new FormData();
    formData.append("mood", selectedMood);
    formData.append("note", noteText.trim() || "Không có ghi chú.");
    formData.append("slug", slug);
    rawFiles.forEach((file) => {
      formData.append("mediaFiles", file);
    });

    setIsLoaded(false);

    guiCheckIn(challenge.id, formData)
      .then((res) => {
        if (res.success && res.data) {
          const updated: BackendChallenge = res.data;
          
          // Map dữ liệu trả về sau khi check-in
          const mapped: Challenge = {
            id: updated.id,
            title: updated.title,
            status: updated.status.toLowerCase() as "active" | "completed",
            totalDays: updated.totalDays,
            completedDaysCount: updated.completedDaysCount,
            streak: updated.streak,
            progress: updated.progress,
            startDate: updated.startDate,
            estimatedEndDate: updated.estimatedEndDate,
            flower: {
              name: updated.flower?.nameFlower || "Hướng Dương",
              type: updated.flower?.type || "sunflower",
              color: updated.flower?.color || "var(--amber)",
              emoji: updated.flower?.emoji || "🌻",
            }
          };

          const mappedLogs: Log[] = updated.historyLogs?.map((l: BackendLog) => ({
            id: l.id,
            day: l.day,
            date: l.loggedDate,
            mood: l.mood || "Bình thường",
            note: l.note || "",
            media: l.mediaFiles?.map((m: BackendMediaFile) => ({
              type: m.type.toLowerCase() as "image" | "video",
              url: m.url
            })) || []
          })) || [];

          setChallenge(mapped);
          setChallengeLogs(mappedLogs);

          // Cập nhật ngày xem hiện tại thành hôm nay
          const currentDay = calcCurrentDay(mapped.startDate, mapped.totalDays);
          setSelectedDay(currentDay);
          const todayLog = mappedLogs.find((l) => l.day === currentDay) || null;
          setSelectedDayLog(todayLog);

          // Reset inputs
          setNoteText("");
          setMediaFiles([]);
          setRawFiles([]);

          // Kích hoạt hiệu ứng pháo hoa hoa giấy
          triggerConfetti();
        } else {
          alert(res.message || "Lỗi khi ghi nhận check-in");
        }
      })
      .catch((err) => {
        console.error(err);
        const error = err as Error;
        alert(error.message || "Lỗi khi ghi nhận check-in");
      })
      .finally(() => {
        setIsLoaded(true);
      });
  };

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-semibold max-w-md text-center">
          {errorMsg}
        </div>
      </div>
    );
  }

  if (!isLoaded || !challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-3 dark:text-ink-4 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Đang tải chi tiết thử thách...</p>
      </div>
    );
  }

  const currentDay = calcCurrentDay(challenge.startDate, challenge.totalDays);
  const hasLogToday = challengeLogs.some((l) => l.day === currentDay);
  const isChallengeCompleted = challenge.status === "completed";

  // Lọc nhật ký trong tab Lịch sử
  const filteredLogs = challengeLogs
    .filter((log) => log.mood.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.day - a.day);

  const theme = getFlowerTheme(challenge.flower.type);

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      <style>{styles}</style>
      
      {/* Confetti Render */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="animate-fall"
          style={{
            left: `${p.left}vw`,
            backgroundColor: p.color,
            width: "12px",
            height: "12px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Detail Banner Card */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4 flex-wrap">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border border-black/5 shrink-0 shadow-sm transition-transform duration-300 hover:animate-wobble cursor-pointer"
            style={{
              backgroundColor: theme.bg,
              borderColor: theme.border,
              color: theme.text,
            }}
          >
            {challenge.flower.emoji}
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wide border",
                  isChallengeCompleted
                    ? "bg-sage-bg border-sage-border text-sage"
                    : "bg-primary-bg border-primary-border text-primary"
                )}
              >
                {isChallengeCompleted ? "Đã hoàn thành" : "Đang chạy"}
              </span>
            </div>
            
            <h2 className="font-serif text-xl md:text-2xl font-bold text-ink leading-tight">
              {challenge.title}
            </h2>
            
            <div className="text-ink-4 text-xs">
              Bắt đầu: <strong>{formatDate(challenge.startDate)}</strong> - Kết thúc ước tính:{" "}
              <strong>{formatDate(challenge.estimatedEndDate)}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {challenge.streak > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-primary-bg border border-primary-border px-4 py-2 rounded-full text-sm font-bold text-primary font-mono shadow-sm">
              <Flame className="w-4 h-4 animate-float" />
              <span>{challenge.streak} ngày streak</span>
            </div>
          )}
          <EditChallengeDialog
            initialTitle={challenge.title}
            initialTotalDays={challenge.totalDays}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onEdit={handleEditChallenge}
          />
          <Button
            onClick={handleDeleteChallenge}
            variant="outline"
            className="border-rose-200 hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold px-4 py-2 rounded-full text-xs shadow-sm transition-all duration-200 cursor-pointer"
          >
            Xóa thử thách
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex border-b border-border gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "pb-3 text-sm font-bold border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer",
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-ink-4 hover:text-ink"
            )}
          >
            Tổng quan & Hôm nay
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "pb-3 text-sm font-bold border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer",
              activeTab === "history"
                ? "border-primary text-primary"
                : "border-transparent text-ink-4 hover:text-ink"
            )}
          >
            Nhật ký hành trình
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6 w-full animate-fade-up">
            {/* Heatmap Grid Card */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-serif text-base md:text-lg font-bold text-ink">
                    Bản đồ tiến độ hành trình
                  </h3>
                  <p className="text-ink-4 text-xs mt-0.5">Bấm chọn một ô ngày để xem nhật ký cụ thể.</p>
                </div>
                <div className="text-primary font-mono text-sm font-bold">
                  Tiến độ: {challenge.progress}% ({challenge.completedDaysCount}/{challenge.totalDays} ngày)
                </div>
              </div>

              {/* Lưới các ô ngày */}
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-12 gap-2">
                {Array.from({ length: challenge.totalDays }, (_, i) => {
                  const dayNum = i + 1;
                  const log = challengeLogs.find((l) => l.day === dayNum);
                  const isSelected = selectedDay === dayNum;

                  let cellClass = "bg-surface text-ink-4 border-border"; // locked

                  if (dayNum > currentDay || currentDay === 0) {
                    cellClass = "bg-surface-2 dark:bg-stone-850/50 text-ink-5 border-dashed cursor-not-allowed";
                  } else if (dayNum === currentDay) {
                    cellClass = log
                      ? "bg-sage-bg border-2 border-sage text-sage font-bold"
                      : "bg-primary-bg border-2 border-primary-soft text-primary font-bold animate-pulse";
                  } else {
                    cellClass = log
                      ? "bg-sage-bg border-sage-border text-sage font-semibold"
                      : "bg-rose-bg border-rose-border text-rose font-semibold";
                  }

                  return (
                    <button
                      key={dayNum}
                      disabled={dayNum > currentDay || currentDay === 0}
                      onClick={() => {
                        setSelectedDay(dayNum);
                        setSelectedDayLog(log || null);
                      }}
                      className={cn(
                        "aspect-square rounded-lg border flex items-center justify-center text-xs font-bold transition-all duration-150 cursor-pointer hover:scale-108",
                        cellClass,
                        isSelected && "ring-2 ring-primary ring-offset-2 dark:ring-offset-stone-900 scale-105"
                      )}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Chú giải màu sắc */}
              <div className="flex flex-wrap gap-4 border-t border-surface-3 pt-4 text-[10px] uppercase tracking-wider font-bold text-ink-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded border border-sage-border bg-sage-bg" />
                  <span>Đã xong</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded border border-rose-border bg-rose-bg" />
                  <span>Bỏ lỡ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded border-2 border-primary-soft bg-primary-bg" />
                  <span>Hôm nay</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded border border-border border-dashed bg-surface-2 dark:bg-stone-850/50" />
                  <span>Chưa mở</span>
                </div>
              </div>
            </div>

            {/* Heatmap Detail Panel */}
            {selectedDay !== null && (
              <div
                className={cn(
                  "border rounded-xl p-4 md:p-5 flex flex-col gap-2.5 animate-fade-up bg-card",
                  (selectedDay > currentDay || currentDay === 0)
                    ? "border-border"
                    : selectedDayLog
                    ? "border-sage-border bg-sage-bg/30"
                    : "border-rose-border bg-rose-bg/30"
                )}
              >
                <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                  <strong className="text-xs uppercase tracking-wider font-bold text-ink">
                    Ngày thứ {selectedDay}
                  </strong>
                  {selectedDayLog && (
                    <span className="text-xs font-bold text-sage px-2 py-0.5 rounded-md bg-sage-bg border border-sage-border">
                      Cảm xúc: {selectedDayLog.mood}
                    </span>
                  )}
                </div>
                
                {(selectedDay > currentDay || currentDay === 0) ? (
                  <p className="text-xs text-ink-4">Ngày này chưa được mở khóa.</p>
                ) : selectedDayLog ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs md:text-sm text-ink-2 dark:text-ink italic leading-relaxed font-serif">
                      &ldquo;{selectedDayLog.note}&rdquo;
                    </p>
                    {selectedDayLog.media && selectedDayLog.media.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedDayLog.media.map((m, idx) => (
                          <div key={idx} className="w-16 h-16 relative rounded-lg overflow-hidden border border-border">
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
                ) : (
                  <p className="text-xs text-rose font-medium">Không có nhật ký cho ngày này (Đã bỏ lỡ).</p>
                )}
              </div>
            )}

            {/* Inline Quick Logger */}
            {!isChallengeCompleted && !hasLogToday && currentDay > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <h3 className="font-serif text-base md:text-lg font-bold text-ink flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Nhật ký ngày hôm nay (Ngày thứ {currentDay})</span>
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Mood selectors */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                      Cảm xúc của bạn hôm nay:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {MOOD_LIST.map((m) => {
                        const isSelected = selectedMood === m.label;
                        return (
                          <button
                            key={m.label}
                            type="button"
                            onClick={() => setSelectedMood(m.label)}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer min-w-[70px] flex-1 bg-surface",
                              isSelected
                                ? "border-primary text-primary ring-2 ring-primary/10 font-bold scale-102"
                                : "border-border text-ink-4 hover:text-ink-2 hover:border-primary-border"
                            )}
                          >
                            <span className="text-xl mb-0.5">{m.emoji}</span>
                            <span className="text-[10px] tracking-wider uppercase font-bold text-center">
                              {m.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note textarea */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                      Ghi nhận nội dung cảm xúc:
                    </Label>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Hôm nay bạn đã làm được gì? Cảm thấy thế nào?"
                      rows={3}
                      className="w-full border border-border bg-surface text-ink p-3 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Media uploads */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                      Thêm hình ảnh hoặc video:
                    </Label>
                    <input
                      type="file"
                      id="detail-media-input"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <Label
                        htmlFor="detail-media-input"
                        className="inline-flex items-center gap-1.5 border border-border bg-surface hover:bg-surface-3 text-ink-2 dark:text-ink hover:text-ink px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors duration-200"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Tải lên ảnh/video</span>
                      </Label>
                    </div>

                    {mediaFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {mediaFiles.map((m, idx) => (
                          <div key={idx} className="w-16 h-16 relative rounded-lg overflow-hidden border border-border group">
                            {m.type === "image" ? (
                              <Image src={m.url} alt="upload preview" fill className="object-cover" unoptimized />
                            ) : (
                              <video src={m.url} className="w-full h-full object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeMediaFile(idx)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Complete Check-in button */}
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={handleCompleteToday}
                      className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-6 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span>Tick hoàn thành ngày hôm nay</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: History Timeline */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-5 w-full animate-fade-up">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 border-b border-black/5 pb-3">
              <div>
                <h3 className="font-serif text-base md:text-lg font-bold text-ink">
                  Nhật ký chi tiết
                </h3>
                <p className="text-ink-4 text-xs mt-0.5">Xem lại các ngày đã tích.</p>
              </div>
              <div className="relative w-full md:max-w-xs">
                <Search className="w-4 h-4 text-ink-4 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo cảm xúc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary w-full"
                />
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <p className="text-sm text-ink-4 text-center py-12">
                Không tìm thấy nhật ký hành trình nào tương thích.
              </p>
            ) : (
              <div className="flex flex-col gap-6 relative pl-6 border-l-2 border-border/60 ml-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="relative flex flex-col gap-2">
                    {/* timeline bullet */}
                    <div className="absolute left-[-31px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background flex items-center justify-center ring-2 ring-primary/20 shadow-sm" />
                    
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-ink">
                        Ngày {log.day} • {formatDate(log.date)}
                      </span>
                      <span className="text-xxs font-bold text-primary px-2 py-0.5 rounded bg-primary-bg border border-primary-border uppercase">
                        {log.mood}
                      </span>
                    </div>

                    <div className="bg-surface-2 dark:bg-stone-850 p-4 rounded-xl border border-border">
                      <p className="text-xs md:text-sm text-ink-2 dark:text-ink leading-relaxed italic font-serif">
                        &ldquo;{log.note}&rdquo;
                      </p>
                      
                      {log.media && log.media.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {log.media.map((m, idx) => (
                            <div key={idx} className="w-20 h-20 relative rounded-lg overflow-hidden border border-border">
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CheerMascot
        streak={challenge.streak}
        isCompleted={isChallengeCompleted}
        hasLoggedToday={hasLogToday}
        flowerEmoji={challenge.flower.emoji}
        currentDay={currentDay}
      />
    </div>
  );
}
