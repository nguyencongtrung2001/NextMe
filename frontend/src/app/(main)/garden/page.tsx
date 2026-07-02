import GardenDashboard from "@/components/vuonhoa/GardenDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khu vườn sinh thái - Grow Personal",
  description: "Trưng bày những loài hoa xinh đẹp bạn đã gieo trồng và chăm sóc thành công từ các thử thách.",
};

export default function GardenPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1">
      <GardenDashboard />
    </div>
  );
}