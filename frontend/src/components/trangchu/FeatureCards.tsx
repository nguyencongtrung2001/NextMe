export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full">
      {/* Card 1: Tạo thử thách */}
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 flex flex-col items-center text-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary-border">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-black/5 bg-[#FEF3C7] shadow-sm hover:animate-wobble cursor-pointer transition-transform duration-300">
          🌻
        </div>
        <h3 className="font-serif text-base md:text-lg font-bold text-ink">Tạo Thử Thách</h3>
        <p className="text-ink-3 dark:text-ink-4 text-xs md:text-sm leading-relaxed max-w-[240px]">
          Chọn thời gian cam kết (30, 66, 90 ngày) và hạt giống loài hoa bạn thích.
        </p>
      </div>

      {/* Card 2: Nhật ký hàng ngày */}
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 flex flex-col items-center text-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary-border">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-black/5 bg-[#FFE4E6] shadow-sm hover:animate-wobble cursor-pointer transition-transform duration-300">
          🌷
        </div>
        <h3 className="font-serif text-base md:text-lg font-bold text-ink">Nhật Ký Hàng Ngày</h3>
        <p className="text-ink-3 dark:text-ink-4 text-xs md:text-sm leading-relaxed max-w-[240px]">
          Tick ghi nhận tiến trình mỗi ngày kèm theo tâm trạng cảm xúc thực tế.
        </p>
      </div>

      {/* Card 3: Khu vườn danh hiệu */}
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 flex flex-col items-center text-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary-border">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-black/5 bg-[#EEF2F6] shadow-sm hover:animate-wobble cursor-pointer transition-transform duration-300">
          🪻
        </div>
        <h3 className="font-serif text-base md:text-lg font-bold text-ink">Khu Vườn Danh Hiệu</h3>
        <p className="text-ink-3 dark:text-ink-4 text-xs md:text-sm leading-relaxed max-w-[240px]">
          Mỗi thử thách hoàn thành sẽ đúc kết thành một bông hoa nở rộ tuyệt đẹp.
        </p>
      </div>
    </div>
  );
}
