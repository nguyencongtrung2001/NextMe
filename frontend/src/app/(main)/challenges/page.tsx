import ChallengeList from "@/components/danhsach/ChallengeList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh sách Thử thách - Grow Personal",
  description: "Quản lý và gieo hạt các thử thách, thói quen tích cực của bạn.",
};

export default function ChallengesPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1">
      <ChallengeList />
    </div>
  );
}
