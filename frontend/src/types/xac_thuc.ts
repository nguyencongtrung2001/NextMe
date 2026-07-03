// Interface chuẩn xác cho dữ liệu Đăng nhập
export interface DuLieuDangNhap {
  email: string;
  password: string;
}

// Interface chuẩn xác cho dữ liệu Đăng ký
export interface DuLieuDangKy {
  email: string;
  password: string;
  name?: string;
}

// Interface ánh xạ thông tin người dùng từ Backend (Schema đổi thành ID Int)
export interface NguoiDung {
  id: number;
  email: string;
  name: string | null;
  role?: string;
}

// Interface phản hồi chung của API
export interface PhanHoiApi {
  thongBao: string;
  nguoiDung?: NguoiDung;
}
