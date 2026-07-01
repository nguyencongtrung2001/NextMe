import type { Metadata } from "next";
import AuthContainer from "@/components/auth/AuthContainer";
import Link from "next/link";
import { X, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Đăng nhập | NextMe",
  description: "Tham gia NextMe - Nơi kết nối và thể hiện cá tính của bạn.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size:24px_24px"></div>
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Info (Name, Avatar) */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 z-20">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
          <User className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-xl text-slate-800 dark:text-slate-100 tracking-tight">
          NextMe
        </span>
      </div>
      
      {/* Exit Button */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <Link 
          href="/" 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
          title="Quay lại trang chủ"
        >
          <X className="w-5 h-5" />
        </Link>
      </div>

      <AuthContainer />
    </div>
  );
}
