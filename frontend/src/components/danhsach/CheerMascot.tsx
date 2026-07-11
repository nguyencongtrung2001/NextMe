"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CheerMascotProps {
  streak: number;
  isCompleted: boolean;
  hasLoggedToday: boolean;
  flowerEmoji: string;
  currentDay: number;
}

export default function CheerMascot({
  streak,
  isCompleted,
  hasLoggedToday,
  flowerEmoji,
  currentDay,
}: CheerMascotProps) {
  const [quote, setQuote] = useState("");
  const [isBouncing, setIsBouncing] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Sinh danh sách câu nói dựa trên trạng thái hiện tại
  const getQuotes = () => {
    if (isCompleted) {
      return [
        "Tuyệt đỉnh! Chúng ta đã cùng nhau vượt qua hành trình này! 🎉",
        "Bạn đã xuất sắc hoàn thành mục tiêu! Tự hào quá đi mất!",
        "Hành trình kết thúc nhưng thói quen tốt đã được gieo mầm!",
      ];
    }
    
    if (currentDay === 0) {
      return [
        "Thử thách chưa chính thức bắt đầu! Hẹn gặp bạn vào ngày mai nhé!",
        "Hãy chuẩn bị tinh thần thật tốt cho ngày mai nhé!",
        "Sắp tới lúc chúng ta cùng nhau cố gắng rồi!",
      ];
    }

    if (!hasLoggedToday) {
      return [
        "Này bạn ơi, hôm nay chưa tưới nước cho cây đâu đấy! Cố lên nhé!",
        "Đừng quên nhiệm vụ hôm nay nha! Tôi luôn ở đây cổ vũ bạn!",
        "Hôm nay bạn thấy thế nào? Hãy hoàn thành mục tiêu và check-in nhé!",
        "Một chút nỗ lực hôm nay sẽ mang lại kết quả lớn ngày mai!",
      ];
    }

    if (hasLoggedToday && streak >= 3) {
      return [
        `Wow! 🔥 Chuỗi ${streak} ngày liên tiếp rồi! Bạn đang làm cực tốt!`,
        `Tuyệt vời! Hãy giữ vững phong độ ${streak} ngày streak này nhé!`,
        "Phong độ của bạn làm tôi thật sự ấn tượng đó!",
      ];
    }

    return [
      "Tuyệt vời! Hôm nay bạn đã làm rất tốt. Hãy nghỉ ngơi thật ngon nhé!",
      "Nhiệm vụ hôm nay đã hoàn thành! Hẹn gặp lại bạn vào ngày mai!",
      "Mỗi ngày một chút, bạn đang tốt lên rất nhiều đó!",
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
    
    setTimeout(() => {
      setIsBouncing(false);
    }, 500); // Khớp với thời gian CSS animation
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Speech Bubble */}
      <div 
        className={cn(
          "bg-card border border-border shadow-lg rounded-2xl rounded-br-sm p-4 max-w-[200px] md:max-w-[240px] pointer-events-auto transition-all duration-300 animate-fade-up origin-bottom-right",
          isBouncing ? "scale-105 shadow-xl" : "scale-100"
        )}
      >
        <p className="text-xs md:text-sm font-medium text-ink-2 leading-relaxed">
          {clickCount >= 10 ? "Đừng chọc tôi nữa, lo làm nhiệm vụ đi kìa! 😂" : quote}
        </p>
      </div>

      {/* Mascot Avatar */}
      <button
        onClick={handleInteract}
        className="relative pointer-events-auto outline-none"
        title="Nhấp vào để trò chuyện"
      >
        <div 
          className={cn(
            "w-16 h-16 md:w-20 md:h-20 bg-surface border-4 border-white dark:border-stone-800 shadow-lg rounded-full flex items-center justify-center text-3xl md:text-4xl transition-transform duration-300 hover:scale-110 cursor-pointer",
            isBouncing ? "animate-wobble scale-110" : "animate-float"
          )}
        >
          {flowerEmoji}
        </div>
        
        {/* Shadow under mascot */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/10 dark:bg-black/40 rounded-[50%] blur-sm pointer-events-none" />
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
      `}</style>
    </div>
  );
}
