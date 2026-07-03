import { DuLieuDangNhap, DuLieuDangKy, PhanHoiApi } from "@/types/xac_thuc";

// Sử dụng biến môi trường NEXT_PUBLIC_API_URL khi đưa lên Vercel. 
// Nếu không có, mặc định chạy localhost:5000 cho lúc code ở máy cá nhân.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";
const API_URL = `${BACKEND_URL}/api/xac-thuc`;

export async function goiDangNhap(duLieu: DuLieuDangNhap): Promise<PhanHoiApi> {
  const response = await fetch(`${API_URL}/dang-nhap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(duLieu),
    credentials: "include", // CỰC KỲ QUAN TRỌNG: Gửi kèm Cookie
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.thongBao || "Đã có lỗi xảy ra khi đăng nhập");
  }
  
  return response.json();
}

export async function goiDangKy(duLieu: DuLieuDangKy): Promise<PhanHoiApi> {
  const response = await fetch(`${API_URL}/dang-ky`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(duLieu),
    credentials: "include", // Bắt buộc
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.thongBao || "Đã có lỗi xảy ra khi đăng ký");
  }
  
  return response.json();
}

export async function layThongTinProfile(): Promise<{ success: boolean; data: { id: number; email: string; name: string; avatarUrl?: string; role?: string } }> {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.thongBao || "Đã có lỗi xảy ra khi lấy thông tin cá nhân");
  }
  
  return response.json();
}
