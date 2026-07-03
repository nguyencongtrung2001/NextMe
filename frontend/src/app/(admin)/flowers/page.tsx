"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { layDanhSachFlowers, taoFlower, capNhatFlower, xoaFlower, AdminFlower } from "@/api/admin";

export default function AdminFlowersPage() {
  const [flowers, setFlowers] = useState<AdminFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // States cho Form
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<AdminFlower | null>(null);

  const [nameFlower, setNameFlower] = useState("");
  const [type, setType] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("var(--amber)");

  const fetchFlowers = () => {
    setLoading(true);
    layDanhSachFlowers()
      .then((res) => {
        if (res.success && res.data) {
          setFlowers(res.data);
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách loài hoa:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFlowers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelectedFlower(null);
    setNameFlower("");
    setType("");
    setEmoji("");
    setColor("var(--amber)");
    setIsOpen(true);
  };

  const handleOpenEdit = (flower: AdminFlower) => {
    setIsEdit(true);
    setSelectedFlower(flower);
    setNameFlower(flower.nameFlower);
    setType(flower.type);
    setEmoji(flower.emoji);
    setColor(flower.color);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && selectedFlower) {
        await capNhatFlower(selectedFlower.id, {
          nameFlower,
          type,
          emoji,
          color,
        });
      } else {
        await taoFlower({
          nameFlower,
          type,
          emoji,
          color,
        });
      }
      setIsOpen(false);
      fetchFlowers();
    } catch (err) {
      alert((err as Error).message || "Đã có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa loài hoa này? Một số thử thách đang liên kết có thể bị lỗi!")) return;
    try {
      await xoaFlower(id);
      fetchFlowers();
    } catch (err) {
      alert((err as Error).message || "Đã có lỗi xảy ra!");
    }
  };

  const filteredFlowers = flowers.filter((f) =>
    f.nameFlower.toLowerCase().includes(search.toLowerCase()) ||
    f.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink tracking-tight">Quản lý Loài hoa</h1>
          <p className="text-ink-4 text-xs">Cấu hình các loài hoa có sẵn trong hệ thống phục vụ người dùng gieo hạt giống.</p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm loài hoa</span>
        </Button>
      </div>

      {/* Filter and Table */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-4" />
          <Input
            placeholder="Tìm kiếm loài hoa, mã type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 border-border bg-surface text-ink text-xs focus-visible:ring-primary rounded-lg"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-semibold">Đang tải danh sách loài hoa...</p>
          </div>
        ) : filteredFlowers.length === 0 ? (
          <div className="text-center py-16 text-xs text-ink-4 italic">Không tìm thấy loài hoa nào khớp bộ lọc.</div>
        ) : (
          /* Table */
          <div className="overflow-x-auto w-full rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-2 dark:bg-stone-850/50 border-b border-border text-ink-3 font-bold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4 text-center">Biểu tượng</th>
                  <th className="p-4">Tên hoa</th>
                  <th className="p-4">Mã nhận diện (type)</th>
                  <th className="p-4">Biến màu chủ đạo</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFlowers.map((flower) => (
                  <tr key={flower.id} className="hover:bg-surface/50 transition-colors text-ink-2 dark:text-ink">
                    <td className="p-4 font-mono font-bold text-ink-4">{flower.id}</td>
                    <td className="p-4 text-center text-2xl select-none">{flower.emoji}</td>
                    <td className="p-4 font-bold">{flower.nameFlower}</td>
                    <td className="p-4 font-mono text-ink-3">{flower.type}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-black/5"
                          style={{ backgroundColor: flower.color.startsWith("var") ? flower.color : flower.color }}
                        />
                        <span className="font-mono text-xxs text-ink-4">{flower.color}</span>
                      </div>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(flower)}
                        title="Chỉnh sửa loài hoa"
                        className="p-1.5 rounded-lg hover:bg-surface-3 text-ink-3 hover:text-ink transition-colors cursor-pointer border border-border/30"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(flower.id)}
                        title="Xóa loài hoa"
                        className="p-1.5 rounded-lg hover:bg-rose-bg text-ink-3 hover:text-rose transition-colors cursor-pointer border border-border/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md w-full bg-card p-6 border border-border rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-ink">
              {isEdit ? "Cập nhật loài hoa" : "Thêm loài hoa mới"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="flower-name" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                Tên hiển thị loài hoa:
              </Label>
              <Input
                id="flower-name"
                type="text"
                required
                placeholder="Ví dụ: Hoa Hướng Dương"
                value={nameFlower}
                onChange={(e) => setNameFlower(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="flower-type" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                Mã nhận diện (type) - Dùng map CSS:
              </Label>
              <Input
                id="flower-type"
                type="text"
                required
                placeholder="Ví dụ: sunflower"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="flower-emoji" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                  Emoji đại diện:
                </Label>
                <Input
                  id="flower-emoji"
                  type="text"
                  required
                  placeholder="Ví dụ: 🌻"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary text-center text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="flower-color" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                  Biến màu hoặc Hex:
                </Label>
                <Input
                  id="flower-color"
                  type="text"
                  required
                  placeholder="Ví dụ: var(--yellow)"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <DialogClose
                render={
                  <Button type="button" variant="outline" className="rounded-lg h-10 border-border text-xs font-bold">
                    Hủy bỏ
                  </Button>
                }
              />
              <Button type="submit" className="bg-primary hover:bg-primary-soft text-primary-foreground rounded-lg h-10 text-xs font-bold">
                {isEdit ? "Cập nhật" : "Tạo loài hoa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
