"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthContainer() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative z-10 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Chào mừng đến NextMe
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Nơi kết nối và thể hiện cá tính của bạn
          </p>
        </div>

        <div className="flex p-1 mb-8 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === "login"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm scale-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 scale-95"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === "register"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm scale-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 scale-95"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <div className="mt-4 relative">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
