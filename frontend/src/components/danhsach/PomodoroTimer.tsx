"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const MODES = {
  focus: { label: "Tập trung", minutes: 25, color: "text-rose-500", bg: "bg-rose-500", ring: "stroke-rose-500" },
  shortBreak: { label: "Nghỉ ngắn", minutes: 5, color: "text-emerald-500", bg: "bg-emerald-500", ring: "stroke-emerald-500" },
  longBreak: { label: "Nghỉ dài", minutes: 15, color: "text-blue-500", bg: "bg-blue-500", ring: "stroke-blue-500" },
};

interface PomodoroTimerProps {
  onComplete?: (mode: TimerMode) => void;
}

export default function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const [customMinutes, setCustomMinutes] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(customMinutes.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Khởi tạo Audio Context cho chuông báo
  const playDing = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.5);

      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio API không được hỗ trợ", e);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          const totalSeconds = customMinutes[mode] * 60;
          setProgress((next / totalSeconds) * 100);
          return next;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(false);
      playDing();
      if (onComplete) {
        onComplete(mode);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, onComplete, playDing, customMinutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsEditing(false);
    setTimeLeft(customMinutes[mode] * 60);
    setProgress(100);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setIsEditing(false);
    setTimeLeft(customMinutes[newMode] * 60);
    setProgress(100);
  };

  const handleEditTime = () => {
    if (isActive) return;
    setIsEditing(true);
    setEditValue(customMinutes[mode].toString());
  };

  const handleSaveTime = () => {
    let newMins = parseInt(editValue, 10);
    if (isNaN(newMins) || newMins <= 0) newMins = 1;
    if (newMins > 120) newMins = 120; // Giới hạn max 120 phút

    setCustomMinutes((prev) => ({ ...prev, [mode]: newMins }));
    setTimeLeft(newMins * 60);
    setProgress(100);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTime();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-3xl shadow-sm max-w-lg mx-auto w-full">
      {/* Tabs chuyển chế độ */}
      <div className="flex items-center gap-2 mb-8 bg-surface p-1.5 rounded-full border border-border/50 overflow-x-auto w-full md:w-auto">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap",
              mode === m
                ? `${MODES[m].bg} text-white shadow-sm`
                : "text-ink-4 hover:text-ink hover:bg-surface-2"
            )}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Vòng tròn đếm ngược */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-8">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
          {/* Vòng nền */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            className="fill-none stroke-surface-3"
            strokeWidth="12"
          />
          {/* Vòng tiến độ */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            className={cn("fill-none transition-all duration-1000 ease-linear", MODES[mode].ring)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {isEditing ? (
            <div className="flex flex-col items-center gap-2 pointer-events-auto">
              <input 
                type="number"
                min="1"
                max="120"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveTime}
                autoFocus
                className="w-24 text-center text-4xl md:text-5xl font-bold font-mono tracking-tighter bg-surface border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-ink-4 text-[10px] uppercase tracking-widest font-bold">Phút</span>
            </div>
          ) : (
            <>
              <span 
                onClick={handleEditTime}
                title={isActive ? "" : "Nhấn để sửa thời gian"}
                className={cn(
                  "text-5xl md:text-7xl font-bold font-mono tracking-tighter transition-colors select-none", 
                  MODES[mode].color,
                  !isActive && "cursor-pointer hover:opacity-80"
                )}
              >
                {formatTime(timeLeft)}
              </span>
              <span className="text-ink-4 text-xs mt-2 uppercase tracking-widest font-bold pointer-events-none">
                {isActive ? "Đang chạy..." : "Đang dừng"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Nút điều khiển */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95",
            MODES[mode].bg
          )}
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current translate-x-0.5" />
          )}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-surface hover:bg-surface-2 border border-border text-ink-3 transition-transform hover:scale-105 active:scale-95"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
