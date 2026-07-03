"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { layDanhSachColorBackgroundsPublic, ColorBackground } from "@/api/thu_thach";

function applyThemeCSS(theme: ColorBackground) {
  if (typeof window === "undefined") return;
  
  let styleTag = document.getElementById("dynamic-theme-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-theme-style";
    document.head.appendChild(styleTag);
  }

  const css = `
    :root {
      --primary: ${theme.lightText};
      --primary-soft: ${theme.lightSoft};
      --primary-bg: ${theme.lightBg};
      --primary-border: ${theme.lightBorder};
      --ring: ${theme.lightText};
    }
    .dark {
      --primary: ${theme.darkText};
      --primary-soft: ${theme.darkSoft};
      --primary-bg: ${theme.darkBg};
      --primary-border: ${theme.darkBorder};
      --ring: ${theme.darkText};
    }
  `;
  styleTag.innerHTML = css;

  localStorage.setItem("theme-active-id", theme.id.toString());
  localStorage.setItem("theme-css-vars", JSON.stringify({
    lightText: theme.lightText,
    lightSoft: theme.lightSoft,
    lightBg: theme.lightBg,
    lightBorder: theme.lightBorder,
    darkText: theme.darkText,
    darkSoft: theme.darkSoft,
    darkBg: theme.darkBg,
    darkBorder: theme.darkBorder
  }));
}

export default function Logo() {
  const [themes, setThemes] = useState<ColorBackground[]>([]);
  const [currentThemeId, setCurrentThemeId] = useState<number | null>(null);

  useEffect(() => {
    layDanhSachColorBackgroundsPublic()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setThemes(res.data);
          
          // Lấy theme đang active từ localStorage
          const savedId = localStorage.getItem("theme-active-id");
          if (savedId) {
            const idNum = parseInt(savedId);
            const activeTheme = res.data.find(t => t.id === idNum);
            if (activeTheme) {
              setCurrentThemeId(idNum);
              applyThemeCSS(activeTheme);
              return;
            }
          }
          // Nếu không có, mặc định dùng theme đầu tiên (Ocean Blue)
          setCurrentThemeId(res.data[0].id);
          applyThemeCSS(res.data[0]);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách màu sắc CSDL:", err);
      });
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (themes.length === 0 || currentThemeId === null) return;

    const currentIdx = themes.findIndex((t) => t.id === currentThemeId);
    if (currentIdx === -1) return;

    const nextIdx = (currentIdx + 1) % themes.length;
    const nextTheme = themes[nextIdx];

    applyThemeCSS(nextTheme);
    setCurrentThemeId(nextTheme.id);
    localStorage.setItem("theme-active-id", nextTheme.id.toString());
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
