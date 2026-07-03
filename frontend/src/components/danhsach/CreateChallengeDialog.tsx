"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { layDanhSachHoa, Flower } from "@/api/thu_thach";

interface CreateChallengeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string, days: number, flowerType: string) => void;
}

export default function CreateChallengeDialog({
  isOpen,
  onOpenChange,
  onCreate,
}: CreateChallengeDialogProps) {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(20);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [selectedFlower, setSelectedFlower] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      layDanhSachHoa()
        .then((res) => {
          if (res.success && res.data && res.data.length > 0) {
            setFlowers(res.data);
            setSelectedFlower(res.data[0].type);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh sách loài hoa từ DB:", err);
        });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedFlower) return;
    onCreate(title, days, selectedFlower);
    setTitle("");
    setDays(20);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            <span>Tạo thử thách mới</span>
          </Button>
        }
      />
      <DialogContent className="max-w-md w-full bg-card p-6 border border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-ink">
            Bắt đầu thử thách mới
          </DialogTitle>
          <DialogDescription className="text-ink-4 text-xs mt-1">
            Đặt tên cho thói quen bạn muốn cam kết, chọn thời hạn và gieo hạt giống một loài hoa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="input-title" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
              Tên thử thách của bạn:
            </Label>
            <Input
              id="input-title"
              type="text"
              placeholder="Ví dụ: Đọc sách 10 trang, Dậy sớm 5:30,..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11 rounded-lg border-border bg-surface text-ink focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="input-days" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
              Thời gian cam kết (số ngày):
            </Label>
            <div className="flex gap-2">
              {[20, 30, 66].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDays(preset)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg border font-bold transition-colors",
                    days === preset 
                      ? "bg-primary/10 text-primary border-primary/30" 
                      : "bg-surface-2 text-ink-3 border-border hover:border-primary/30"
                  )}
                >
                  {preset} ngày
                </button>
              ))}
            </div>
            <Input
              id="input-days"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 20)}
              required
              className="h-11 rounded-lg border-border bg-surface text-ink focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
              Chọn hạt giống loài hoa:
            </Label>
            {flowers.length === 0 ? (
              <div className="text-center py-4 text-xs text-ink-4">Đang tải danh sách hạt giống...</div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-[160px] overflow-y-auto pr-1">
                {flowers.map((f) => {
                  const isSelected = selectedFlower === f.type;
                  return (
                    <button
                      key={f.type}
                      type="button"
                      onClick={() => setSelectedFlower(f.type)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer bg-surface",
                        isSelected
                          ? "border-primary ring-2 ring-primary/10 shadow-sm font-semibold scale-102"
                          : "border-border hover:border-primary-border"
                      )}
                    >
                      <span className="text-2xl mb-1">{f.emoji}</span>
                      <span className="text-xxs md:text-xs text-ink-3 dark:text-ink-4 text-center line-clamp-1">
                        {f.nameFlower}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 gap-2">
            <DialogClose
              render={
                <Button type="button" variant="outline" className="rounded-lg h-11 border-border font-bold">
                  Hủy bỏ
                </Button>
              }
            />
            <Button type="submit" className="bg-primary hover:bg-primary-soft text-primary-foreground rounded-lg h-11 font-bold">
              Kích hoạt hạt giống
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
