"use client";

import { useEffect, useState } from "react";
import { Users, Sprout, CheckCircle2, Calendar, Flame, Loader2 } from "lucide-react";
import { layStats, AdminStats } from "@/api/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    layStats()
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải thông số thống kê:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-3 dark:text-ink-4 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Đang tải báo cáo hệ thống...</p>
      </div>
    );
  }

  const statItems = [
    {
      title: "Tổng tài khoản",
      value: stats?.tongUser || 0,
      desc: "Người dùng đăng ký hệ thống",
      icon: Users,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50",
    },
    {
      title: "Tổng thử thách gieo hạt",
      value: stats?.tongThuThach || 0,
      desc: "Thói quen được thiết lập",
      icon: Sprout,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    },
    {
      title: "Thử thách hoàn thành",
      value: stats?.tongThuThachHoanThanh || 0,
      desc: "Chuỗi thói quen đã về đích",
      icon: CheckCircle2,
      color: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50",
    },
    {
      title: "Nhật ký check-in",
      value: stats?.tongNhatKyCheckin || 0,
      desc: "Số lần check-in tích lũy",
      icon: Calendar,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary-border/40 rounded-2xl p-6 md:p-8 flex flex-col gap-2">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink leading-tight">
          Chào mừng trở lại, Quản trị viên!
        </h1>
        <p className="text-xs md:text-sm text-ink-3 dark:text-ink-4 max-w-xl">
          Đây là trung tâm điều hành của NextMe. Tại đây, bạn có thể giám sát số liệu hoạt động, quản lý tài khoản người dùng, hạt giống hoa và cấu hình bảng màu sắc hệ thống.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`bg-card border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${item.color.split(" ").slice(0, 2).join(" ")}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-4">
                    {item.title}
                  </span>
                  <span className="text-3xl font-black text-ink font-mono leading-none">
                    {item.value}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl border bg-card ${item.color.split(" ").slice(2).join(" ")}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xxs md:text-xs text-ink-3 dark:text-ink-4 mt-auto">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Overview Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key indicator */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
          <h3 className="font-serif text-base md:text-lg font-bold text-ink flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <span>Chỉ số hoạt động cốt lõi</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="flex flex-col gap-1 bg-surface-2 dark:bg-stone-850/50 p-4 rounded-xl">
              <span className="text-xxs font-bold text-ink-4 uppercase tracking-wider">Streak trung bình</span>
              <strong className="text-2xl font-black text-ink font-mono">{stats?.streakTrungBinh || 0} ngày</strong>
              <p className="text-[10px] text-ink-4 mt-1">Duy trì thói quen của mỗi user</p>
            </div>

            <div className="flex flex-col gap-1 bg-surface-2 dark:bg-stone-850/50 p-4 rounded-xl">
              <span className="text-xxs font-bold text-ink-4 uppercase tracking-wider">Tỷ lệ hoàn thành</span>
              <strong className="text-2xl font-black text-ink font-mono">
                {stats?.tongThuThach && stats.tongThuThach > 0
                  ? Math.round(((stats.tongThuThachHoanThanh) / stats.tongThuThach) * 100)
                  : 0}
                %
              </strong>
              <p className="text-[10px] text-ink-4 mt-1">Tỷ lệ thử thách về đích thành công</p>
            </div>
          </div>
        </div>

        {/* System Server Info */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-serif text-base md:text-lg font-bold text-ink">Thông tin máy chủ</h3>
          <div className="flex flex-col gap-2.5 mt-2 text-xs">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-ink-4">Môi trường:</span>
              <span className="font-bold text-ink-2 dark:text-ink">Production (Render)</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-ink-4">Múi giờ hệ thống:</span>
              <span className="font-bold text-ink-2 dark:text-ink">UTC / GMT+7</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-ink-4">Cơ sở dữ liệu:</span>
              <span className="font-bold text-ink-2 dark:text-ink">PostgreSQL via Prisma</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-4">Lưu trữ hình ảnh:</span>
              <span className="font-bold text-ink-2 dark:text-ink">Cloudinary Media</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
