"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const THEMES = [
  "theme-blue",
  "theme-moss",
  "theme-ice",
  "theme-slate",
  "theme-olive",
  "theme-bronze"
];

export default function Logo() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("theme-class") || "theme-blue";
    const idx = THEMES.indexOf(saved);
    if (idx !== -1) {
      setTimeout(() => {
        setCurrentThemeIndex(idx);
      }, 0);
    }
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextIdx = (currentThemeIndex + 1) % THEMES.length;
    const prevTheme = THEMES[currentThemeIndex];
    const nextTheme = THEMES[nextIdx];

    const doc = document.documentElement;
    if (prevTheme !== "theme-blue") {
      doc.classList.remove(prevTheme);
    }
    if (nextTheme !== "theme-blue") {
      doc.classList.add(nextTheme);
    }

    localStorage.setItem("theme-class", nextTheme);
    setCurrentThemeIndex(nextIdx);
  };

  return (
    <div className="fixed top-6 right-6 md:left-6 md:right-auto z-50 flex items-center gap-3 group animate-fade-in">
      {/* N Logo Icon Button */}
      <button
        type="button"
        onClick={handleLogoClick}
        title="Nhấp để đổi màu chủ đạo hệ thống"
        className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-0 outline-none"
      >
        <span className="font-black text-2xl font-serif select-none">N</span>
      </button>

      {/* NextMe Text Link */}
      <Link href="/" className="font-extrabold text-2xl text-ink tracking-tight hidden md:block hover:text-primary transition-colors duration-200">
        NextMe
      </Link>
    </div>
  );
}
