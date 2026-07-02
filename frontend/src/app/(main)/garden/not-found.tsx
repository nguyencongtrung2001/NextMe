"use client";

import Link from "next/link";
import { ArrowLeft, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GardenNotFound() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 flex flex-col items-center justify-center gap-5 text-center flex-1">
      <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-primary border border-border shadow-sm">
        <Flower className="w-8 h-8" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-md">
        <h2 className="font-serif text-xl font-bold text-ink">Không tìm thấy vườn hoa</h2>
        <p className="text-xs text-ink-4 leading-relaxed">
          Khu vườn sinh thái hoặc đường dẫn bạn đang tìm kiếm không tồn tại hoặc đã được di dời sang địa chỉ khác.
        </p>
      </div>

      <Link href="/challenges">
        <Button
          variant="outline"
          className="border-border hover:bg-surface-3 text-ink-2 font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay về trang Thử thách</span>
        </Button>
      </Link>
    </div>
  );
}
