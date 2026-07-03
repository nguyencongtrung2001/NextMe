"use client";

import { useState, useEffect } from "react";
import { LogOut, User, Shield } from "lucide-react";
import Link from "next/link";
import { layThongTinProfile } from "@/api/xac_thuc";

export default function UserMenu() {
  const [userName, setUserName] = useState("NextMe User");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    layThongTinProfile()
      .then((res) => {
        if (active && res.success && res.data) {
          if (res.data.name) setUserName(res.data.name);
          if (res.data.role) setRole(res.data.role);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy thông tin user:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-fade-in">
      <div className="flex items-center gap-2 bg-surface/85 dark:bg-surface-2/80 backdrop-blur-xl border border-border p-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>

        {/* Name (Ẩn trên mobile để tiết kiệm diện tích) */}
        <div className="flex-col hidden md:flex min-w-[90px] ml-1">
          <span className="text-sm font-bold text-ink leading-tight">{userName}</span>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-border mx-1 hidden md:block"></div>

        {/* Nút Admin (Chỉ hiển thị cho ADMIN) */}
        {role === "ADMIN" && (
          <Link
            href="/admin/users"
            className="w-10 h-10 rounded-full hover:bg-primary-bg text-ink-3 hover:text-primary flex items-center justify-center transition-all mr-0.5 active:scale-95 border border-border/30"
            title="Trang quản trị (Admin Panel)"
          >
            <Shield className="w-[18px] h-[18px]" />
          </Link>
        )}

        {/* Nút Exit */}
        <Link
          href="/auth"
          className="w-10 h-10 rounded-full hover:bg-rose-bg dark:hover:bg-rose-900/30 text-ink-3 hover:text-rose flex items-center justify-center transition-all mr-0.5 active:scale-95"
          title="Đăng xuất"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </Link>
      </div>
    </div>
  );
}
