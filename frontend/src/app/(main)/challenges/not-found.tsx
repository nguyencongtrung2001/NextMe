import Link from "next/link";
import { Sprout } from "lucide-react";

export default function ChallengesNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-sage-bg flex items-center justify-center text-sage mb-4 shadow-sm border border-sage-border animate-wobble">
        <Sprout className="w-8 h-8" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold font-serif text-ink mb-2 text-center">
        Không tìm thấy thử thách
      </h2>
      <p className="text-ink-3 dark:text-ink-4 text-center max-w-md mb-6">
        Thử thách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa khỏi hệ thống.
      </p>
      <Link
        href="/challenges"
        className="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-soft transition-colors shadow-sm"
      >
        Xem danh sách thử thách
      </Link>
    </div>
  );
}
