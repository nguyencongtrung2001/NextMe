"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, LayoutDashboard, Users, Sprout, Palette, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { layThongTinProfile } from "@/api/xac_thuc";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    layThongTinProfile()
      .then((res) => {
        if (res.success && res.data && res.data.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.replace("/");
        }
      })
      .catch(() => {
        setIsAdmin(false);
        router.replace("/auth");
      });
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-ink-3 dark:text-ink-4 bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Đang xác thực quyền quản trị...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return null;
  }

  const sidebarLinks = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/users", label: "Tài khoản", icon: Users },
    { href: "/admin/flowers", label: "Loài hoa", icon: Sprout },
    { href: "/admin/themes", label: "Chủ đề màu", icon: Palette },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="flex flex-col gap-6 p-6">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-ink leading-tight">NextMe Admin</span>
              <span className="text-[10px] uppercase font-bold text-ink-4 tracking-wider">Trang quản trị</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-4">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                      : "text-ink-3 dark:text-ink-4 hover:bg-surface-2 dark:hover:bg-surface-3 hover:text-ink"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back Link */}
        <div className="p-6 border-t border-border">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-3 text-ink-2 dark:text-ink text-xs font-bold transition-all duration-200 border border-border"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navigation bar */}
        <header className="md:hidden border-b border-border bg-card p-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-ink leading-tight">NextMe Admin</span>
          </div>

          <div className="flex items-center gap-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-ink-4 hover:bg-surface"
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </Link>
              );
            })}
            <Link
              href="/"
              title="Quay lại Trang chủ"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-4 hover:bg-surface ml-1 border border-border/50"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl w-full mx-auto pb-24 md:pb-8 animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
