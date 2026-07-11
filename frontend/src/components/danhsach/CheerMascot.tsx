"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CheerMascotProps {
  streak: number;
  isCompleted: boolean;
  hasLoggedToday: boolean;
  currentDay: number;
}

export default function CheerMascot({
  streak,
  isCompleted,
  hasLoggedToday,
  currentDay,
}: CheerMascotProps) {
  const [quote, setQuote] = useState("");
  const [isBouncing, setIsBouncing] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const getQuotes = () => {
    if (isCompleted) {
      return [
        "Tuyệt đỉnh! Cậu siêu quá đi mất! 🎉",
        "Chúng ta đã làm được rồi! Tự hào về cậu!",
      ];
    }
    if (currentDay === 0) {
      return ["Chưa bắt đầu! Hẹn cậu ngày mai nhé!"];
    }
    if (!hasLoggedToday) {
      return [
        "Nhớ tưới nước cho tớ hôm nay nhé!",
        "Tớ chờ cậu nãy giờ nè, check-in đi!",
      ];
    }
    if (hasLoggedToday && streak >= 3) {
      return [
        `Chuỗi ${streak} ngày rồi! Cậu đang cháy quá! 🔥`,
        `Thật đáng kinh ngạc! Giữ vững phong độ nha!`,
      ];
    }
    return [
      "Hôm nay cậu làm tốt lắm! Nghỉ ngơi thôi!",
      "Nhiệm vụ hoàn thành! Chúc ngủ ngon nha!",
    ];
  };

  const pickRandomQuote = () => {
    const quotes = getQuotes();
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    pickRandomQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, hasLoggedToday, streak, currentDay]);

  const handleInteract = () => {
    setIsBouncing(true);
    pickRandomQuote();
    setClickCount((prev) => prev + 1);
    setTimeout(() => setIsBouncing(false), 500);
  };

  return (
    <div className="relative flex items-center justify-end -mt-8 md:-mt-12 mb-2 z-10 w-full animate-fade-in pointer-events-none">
      {/* Speech Bubble */}
      <div 
        className={cn(
          "bg-white dark:bg-stone-800 border border-border shadow-md rounded-2xl rounded-br-sm p-3 max-w-[200px] pointer-events-auto transition-all duration-300 mr-2 relative",
          isBouncing ? "scale-105" : "scale-100"
        )}
      >
        <p className="text-xs md:text-sm font-semibold text-ink-2 leading-snug">
          {clickCount >= 10 ? "Trời ơi đừng chọc tớ nữa! 😂" : quote}
        </p>
      </div>

      {/* Image Mascot */}
      <button
        onClick={handleInteract}
        className="relative pointer-events-auto outline-none transition-transform duration-300 hover:scale-110 cursor-pointer flex-shrink-0"
        title="Nhấp vào để trò chuyện"
      >
        <div 
          className={cn(
            "w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-full border-4 border-white dark:border-stone-800 shadow-sm bg-white",
            isBouncing ? "animate-wobble" : "animate-float"
          )}
        >
          <Image 
            src="/mascot.png" 
            alt="Mascot" 
            fill 
            className="object-cover" 
            unoptimized 
          />
        </div>
      </button>

      <style jsx>{`
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(-5deg); }
        }
        .animate-wobble {
          animation: wobble 0.5s ease-in-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
