import { DuLieuDangNhap, DuLieuDangKy, PhanHoiApi } from "@/types/xac_thuc";

const API_URL = "http://localhost:5000/api/xac-thuc";

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
