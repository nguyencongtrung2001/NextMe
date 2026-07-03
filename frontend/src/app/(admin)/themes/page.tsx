"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit, Loader2, Wand2 } from "lucide-react";
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
import { layDanhSachColorBackgrounds, taoColorBackground, capNhatColorBackground, xoaColorBackground, AdminColorBackground } from "@/api/admin";

// --- HSL Color Conversion Helpers ---
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  const toHex = (val: number) => {
    const hex = Math.round((val + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<AdminColorBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // States cho Form
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<AdminColorBackground | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  
  const [lightText, setLightText] = useState("#2563EB");
  const [lightSoft, setLightSoft] = useState("#3B82F6");
  const [lightBg, setLightBg] = useState("#EFF6FF");
  const [lightBorder, setLightBorder] = useState("#BFDBFE");

  const [darkText, setDarkText] = useState("#3B82F6");
  const [darkSoft, setDarkSoft] = useState("#60A5FA");
  const [darkBg, setDarkBg] = useState("#172554");
  const [darkBorder, setDarkBorder] = useState("#1E3A8A");

  // State màu nguồn để auto-generate
  const [seedColor, setSeedColor] = useState("#3B82F6");

  const fetchThemes = () => {
    setLoading(true);
    layDanhSachColorBackgrounds()
      .then((res) => {
        if (res.success && res.data) {
          setThemes(res.data);
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách chủ đề màu sắc:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchThemes();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAutoGenerate = () => {
    try {
      const { h, s } = hexToHsl(seedColor);
      
      // Auto Light values
      setLightText(hslToHex(h, s, 45));       // L=45% cho độ cản sáng, dễ đọc chữ
      setLightSoft(seedColor);                 // Màu soft chính là màu nguồn
      setLightBg(hslToHex(h, Math.min(s, 30), 97));   // Nền sáng mờ
      setLightBorder(hslToHex(h, Math.min(s, 40), 90)); // Viền mượt

      // Auto Dark values
      setDarkText(seedColor);                  // Chữ tối chính là màu nguồn nổi bật
      setDarkSoft(hslToHex(h, s, 60));         // L=60% cho màu sáng hơn
      setDarkBg(hslToHex(h, Math.min(s, 25), 8));      // Nền tối mờ
      setDarkBorder(hslToHex(h, Math.min(s, 25), 15));  // Viền trầm
    } catch {
      alert("Định dạng mã màu không hợp lệ!");
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelectedTheme(null);
    setName("");
    setType("");
    setSeedColor("#3B82F6");
    setLightText("#2563EB");
    setLightSoft("#3B82F6");
    setLightBg("#EFF6FF");
    setLightBorder("#BFDBFE");
    setDarkText("#3B82F6");
    setDarkSoft("#60A5FA");
    setDarkBg("#172554");
    setDarkBorder("#1E3A8A");
    setIsOpen(true);
  };

  const handleOpenEdit = (theme: AdminColorBackground) => {
    setIsEdit(true);
    setSelectedTheme(theme);
    setName(theme.name);
    setType(theme.type);
    setSeedColor(theme.lightSoft);
    setLightText(theme.lightText);
    setLightSoft(theme.lightSoft);
    setLightBg(theme.lightBg);
    setLightBorder(theme.lightBorder);
    setDarkText(theme.darkText);
    setDarkSoft(theme.darkSoft);
    setDarkBg(theme.darkBg);
    setDarkBorder(theme.darkBorder);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        type,
        lightText,
        lightSoft,
        lightBg,
        lightBorder,
        darkText,
        darkSoft,
        darkBg,
        darkBorder,
      };

      if (isEdit && selectedTheme) {
        await capNhatColorBackground(selectedTheme.id, payload);
      } else {
        await taoColorBackground(payload);
      }
      setIsOpen(false);
      fetchThemes();
    } catch (err) {
      alert((err as Error).message || "Đã có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tông màu này?")) return;
    try {
      await xoaColorBackground(id);
      fetchThemes();
    } catch (err) {
      alert((err as Error).message || "Đã có lỗi xảy ra!");
    }
  };

  const filteredThemes = themes.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink tracking-tight">Quản lý Bảng màu</h1>
          <p className="text-ink-4 text-xs">Cấu hình các tông màu chủ đạo hệ thống. Người dùng có thể chọn các tông màu này từ logo.</p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tông màu</span>
        </Button>
      </div>

      {/* Filter and Table */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-4" />
          <Input
            placeholder="Tìm kiếm tông màu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 border-border bg-surface text-ink text-xs focus-visible:ring-primary rounded-lg"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-semibold">Đang tải danh sách tông màu...</p>
          </div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-16 text-xs text-ink-4 italic">Không tìm thấy tông màu nào khớp bộ lọc.</div>
        ) : (
          /* Table */
          <div className="overflow-x-auto w-full rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-2 dark:bg-stone-850/50 border-b border-border text-ink-3 font-bold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Tên chủ đề</th>
                  <th className="p-4">Mã định danh (type)</th>
                  <th className="p-4">Light Mode Preview</th>
                  <th className="p-4">Dark Mode Preview</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredThemes.map((theme) => (
                  <tr key={theme.id} className="hover:bg-surface/50 transition-colors text-ink-2 dark:text-ink">
                    <td className="p-4 font-mono font-bold text-ink-4">{theme.id}</td>
                    <td className="p-4 font-bold">{theme.name}</td>
                    <td className="p-4 font-mono text-ink-3">{theme.type}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg border max-w-[150px]" style={{ backgroundColor: theme.lightBg, borderColor: theme.lightBorder }}>
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.lightSoft }} />
                        <span className="font-bold font-mono text-[10px]" style={{ color: theme.lightText }}>Text</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg border max-w-[150px] bg-slate-900" style={{ backgroundColor: theme.darkBg, borderColor: theme.darkBorder }}>
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.darkSoft }} />
                        <span className="font-bold font-mono text-[10px]" style={{ color: theme.darkText }}>Text</span>
                      </div>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(theme)}
                        title="Chỉnh sửa bảng màu"
                        className="p-1.5 rounded-lg hover:bg-surface-3 text-ink-3 hover:text-ink transition-colors cursor-pointer border border-border/30"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(theme.id)}
                        title="Xóa tông màu"
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
        <DialogContent className="max-w-2xl w-full bg-card p-6 border border-border rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-ink">
              {isEdit ? "Cập nhật tông màu" : "Thêm tông màu mới"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="theme-name" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                  Tên hiển thị tông màu:
                </Label>
                <Input
                  id="theme-name"
                  type="text"
                  required
                  placeholder="Ví dụ: Forest Green"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="theme-type" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                  Mã định danh (type):
                </Label>
                <Input
                  id="theme-type"
                  type="text"
                  required
                  placeholder="Ví dụ: moss"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Smart Auto Generator Bar */}
            <div className="bg-surface-2 dark:bg-stone-850/50 border border-border p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-ink-2">Trình tạo màu tự động (Wand)</span>
                <span className="text-[10px] text-ink-4">Chọn 1 màu chính, hệ thống sẽ tự tính toán 8 màu còn lại.</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={seedColor}
                  onChange={(e) => setSeedColor(e.target.value)}
                  className="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
                />
                <Button
                  type="button"
                  onClick={handleAutoGenerate}
                  className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-3 py-1.5 h-8 text-xxs rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Sinh mã màu</span>
                </Button>
              </div>
            </div>

            {/* Mode Split Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Light Mode Colors */}
              <div className="flex flex-col gap-3 border-r border-border/50 pr-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary/20 pb-1.5">Light Mode</h4>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Primary Text:</Label>
                    <Input type="text" value={lightText} onChange={(e) => setLightText(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Primary Soft:</Label>
                    <Input type="text" value={lightSoft} onChange={(e) => setLightSoft(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Background:</Label>
                    <Input type="text" value={lightBg} onChange={(e) => setLightBg(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Border:</Label>
                    <Input type="text" value={lightBorder} onChange={(e) => setLightBorder(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                </div>
              </div>

              {/* Dark Mode Colors */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose border-b border-rose/20 pb-1.5">Dark Mode</h4>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Primary Text:</Label>
                    <Input type="text" value={darkText} onChange={(e) => setDarkText(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Primary Soft:</Label>
                    <Input type="text" value={darkSoft} onChange={(e) => setDarkSoft(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Background:</Label>
                    <Input type="text" value={darkBg} onChange={(e) => setDarkBg(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xxs text-ink-3">Border:</Label>
                    <Input type="text" value={darkBorder} onChange={(e) => setDarkBorder(e.target.value)} className="w-32 h-8 text-xxs font-mono" />
                  </div>
                </div>
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
                {isEdit ? "Cập nhật" : "Tạo tông màu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
