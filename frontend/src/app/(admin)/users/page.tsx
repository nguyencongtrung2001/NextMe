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
import { layDanhSachUsers, taoUser, capNhatUser, xoaUser, AdminUser } from "@/api/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // States cho Form
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const fetchUsers = () => {
    setLoading(true);
    layDanhSachUsers()
      .then((res) => {
        if (res.success && res.data) {
          setUsers(res.data);
        }
      })
      .catch((err) => console.error("Lỗi lấy danh sách tài khoản:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelectedUser(null);
    setEmail("");
    setName("");
    setPassword("");
    setRole("USER");
    setIsOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setIsEdit(true);
    setSelectedUser(user);
    setEmail(user.email);
    setName(user.name || "");
    setPassword(""); // Không load mật khẩu cũ vì lý do bảo mật
    setRole(user.role);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && selectedUser) {
        // Cập nhật
        await capNhatUser(selectedUser.id, {
          email,
          name,
          role,
          ...(password ? { password } : {}),
        });
      } else {
        // Thêm mới
        await taoUser({
          email,
          name,
          password,
          role,
        });
      }
      setIsOpen(false);
      fetchUsers();
    } catch (err) {
      alert((err as Error).message || "Đã có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này? Hành động này sẽ xóa toàn bộ thử thách liên quan!")) return;
    try {
      await xoaUser(id);
      fetchUsers();
    } catch (err) {
      alert((err as Error).message || "Đã có lỗi xảy ra!");
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink tracking-tight">Quản lý Tài khoản</h1>
          <p className="text-ink-4 text-xs">Xem danh sách, chỉnh sửa vai trò, reset mật khẩu hoặc xóa tài khoản hệ thống.</p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-soft text-primary-foreground font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tài khoản</span>
        </Button>
      </div>

      {/* Filter and Table */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-4" />
          <Input
            placeholder="Tìm kiếm theo email, tên người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 border-border bg-surface text-ink text-xs focus-visible:ring-primary rounded-lg"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-semibold">Đang tải danh sách tài khoản...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-xs text-ink-4 italic">Không tìm thấy tài khoản nào khớp với bộ lọc.</div>
        ) : (
          /* Responsive Table Container */
          <div className="overflow-x-auto w-full rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-2 dark:bg-stone-850/50 border-b border-border text-ink-3 font-bold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Người dùng</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface/50 transition-colors text-ink-2 dark:text-ink">
                    <td className="p-4 font-mono font-bold text-ink-4">{user.id}</td>
                    <td className="p-4 font-bold">{user.name || <span className="italic text-ink-4">Chưa đặt tên</span>}</td>
                    <td className="p-4 font-medium">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          user.role === "ADMIN"
                            ? "bg-rose-bg border-rose-border text-rose"
                            : "bg-primary-bg border-primary-border text-primary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        title="Chỉnh sửa tài khoản"
                        className="p-1.5 rounded-lg hover:bg-surface-3 text-ink-3 hover:text-ink transition-colors cursor-pointer border border-border/30"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        title="Xóa tài khoản"
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
              {isEdit ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="user-email" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                Email đăng nhập:
              </Label>
              <Input
                id="user-email"
                type="email"
                required
                disabled={isEdit}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="user-name" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                Tên hiển thị:
              </Label>
              <Input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="user-password" className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                {isEdit ? "Mật khẩu mới (Bỏ trống nếu giữ nguyên):" : "Mật khẩu:"}
              </Label>
              <Input
                id="user-password"
                type="password"
                required={!isEdit}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface text-ink text-xs focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-ink-2 dark:text-ink uppercase tracking-wider">
                Vai trò phân quyền:
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "USER" as const, label: "Người dùng (USER)" },
                  { value: "ADMIN" as const, label: "Quản trị viên (ADMIN)" },
                ].map((r) => {
                  const isSelected = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-ink-4 hover:border-primary-border"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
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
                {isEdit ? "Cập nhật" : "Tạo tài khoản"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
