import ChallengeDetail from "@/components/danhsach/ChallengeDetail";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "c1" },
    { slug: "c2" },
    { slug: "c3" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Custom title formatting based on slug
  let title = "Chi tiết Thử thách - Grow Personal";
  if (slug === "c1") title = "Dậy sớm 5:30 AM - Grow Personal";
  else if (slug === "c2") title = "Đọc 10 trang sách - Grow Personal";
  else if (slug === "c3") title = "Tập Yoga 15 phút - Grow Personal";

  return {
    title,
    description: "Xem chi tiết tiến trình gieo trồng và ghi nhật ký hàng ngày của bạn.",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1 animate-fade-up">
      <ChallengeDetail slug={slug} />
    </div>
  );
}
