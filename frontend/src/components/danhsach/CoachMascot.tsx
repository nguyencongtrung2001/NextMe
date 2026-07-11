"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getMascotQuote } from "@/constants/mascot";

interface CoachMascotProps {
  progress: number;
  isTodayCompleted: boolean;
  challengeTitle: string;
}

export default function CoachMascot({
  progress,
  isTodayCompleted,
  challengeTitle,
}: CoachMascotProps) {
  const [currentQuote, setCurrentQuote] = useState("");
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const quote = getMascotQuote(progress, isTodayCompleted, challengeTitle);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentQuote(quote);
  }, [progress, isTodayCompleted, challengeTitle]);

  const handleInteract = () => {
    if (isInteracting) return;
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 800);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] items-center relative overflow-hidden group">
      
      {/* 1. Vùng đồ họa Mascot (Chiếm 1 phần bên trái) */}
      <div 
        className="w-full flex justify-center items-center relative md:col-span-1 h-[140px] md:h-[160px] cursor-pointer"
        onClick={handleInteract}
        title="Bấm vào để tương tác"
      >
        <div 
          className={cn(
            "relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-white dark:bg-stone-800 shadow-md border-4 border-white dark:border-stone-700 overflow-hidden flex items-center justify-center transition-transform",
            !isTodayCompleted ? "animate-walk-fast" : "animate-happy-jump",
            isInteracting && "scale-110"
          )}
        >
          <Image
            src="/mascot.png"
            alt="Coach Mascot"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        {/* Bóng mờ dưới chân */}
        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/10 dark:bg-black/30 rounded-[50%] blur-sm pointer-events-none" />
      </div>

      {/* 2. Khung bong bóng thoại kiểu Duolingo (Chiếm 2 phần bên phải) */}
      <div className="md:col-span-2 relative flex flex-col justify-center h-full w-full">
        {/* Mũi tên nhọn chỉ vào nhân vật trên desktop */}
        <div className="hidden md:block absolute left-[-11px] top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-2 dark:bg-stone-850 border-b border-l border-border rotate-45 z-10" />
        
        {/* Mũi tên nhọn chỉ vào nhân vật trên mobile (chỉ lên trên) */}
        <div className="block md:hidden absolute top-[-11px] left-1/2 -translate-x-1/2 w-5 h-5 bg-surface-2 dark:bg-stone-850 border-t border-l border-border rotate-45 z-10" />
        
        <div className="w-full bg-surface-2 dark:bg-stone-850 border border-border rounded-2xl p-5 md:p-6 shadow-inner min-h-[100px] flex flex-col justify-center relative z-20">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-500 text-white animate-pulse">
              Doraemon Coach
            </span>
            <span className="text-xs text-ink-4 font-semibold">
              Tiến độ: {progress}%
            </span>
          </div>
          
          <p className="text-sm md:text-base font-semibold text-ink-2 dark:text-ink leading-relaxed transition-all duration-300">
            &ldquo;{currentQuote}&rdquo;
          </p>
        </div>
      </div>

      <style jsx>{`
        /* Hiệu ứng đi bộ sốt ruột (khi chưa làm) */
        .animate-walk-fast {
          animation: walkFast 2.5s ease-in-out infinite;
        }
        @keyframes walkFast {
          0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          25% { transform: translateX(-10px) translateY(-5px) rotate(-8deg); }
          50% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          75% { transform: translateX(10px) translateY(-5px) rotate(8deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
        }

        /* Hiệu ứng nhảy múa ăn mừng (khi đã làm) */
        .animate-happy-jump {
          animation: happyJump 2s ease-in-out infinite;
        }
        @keyframes happyJump {
          0%, 100% { transform: translateY(0) scale(1); }
          20% { transform: translateY(-15px) scale(1.05) rotate(-5deg); }
          40% { transform: translateY(0) scale(1) rotate(5deg); }
          60% { transform: translateY(-10px) scale(1.02) rotate(-5deg); }
          80% { transform: translateY(0) scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
