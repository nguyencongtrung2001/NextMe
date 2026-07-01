import TodayDashboard from "@/components/homnay/TodayDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hành trình Hôm nay - Grow Personal",
  description: "Xem và kiểm tra tiến độ hoàn thành các thử thách gieo trồng trong ngày hôm nay của bạn.",
};

export default function TodayPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1">
      <TodayDashboard />
    </div>
  );
}
