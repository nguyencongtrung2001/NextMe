import type { Metadata } from "next";
import AuthContainer from "@/components/auth/AuthContainer";

export const metadata: Metadata = {
  title: "Đăng nhập | NextMe",
  description: "Tham gia NextMe - Nơi kết nối và thể hiện cá tính của bạn.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <AuthContainer />
    </div>
  );
}
