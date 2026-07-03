const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";
const API_URL = `${BACKEND_URL}/api/thu-thach`;

export interface Flower {
  id: number;
  nameFlower: string;
  type: string;
  color: string;
  emoji: string;
  createdAt: string;
}

export interface MediaFile {
  id: string;
  logId: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  name?: string;
  createdAt: string;
}

export interface Log {
  id: string;
  challengeId: string;
  day: number;
  loggedDate: string;
  status: "COMPLETED" | "MISSED" | "PENDING";
  mood?: string;
  note?: string;
  mediaFiles?: MediaFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  totalDays: number;
  completedDaysCount: number;
  streak: number;
  progress: number;
  startDate: string;
  estimatedEndDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  flower?: Flower;
  historyLogs?: Log[];
}

export interface TaoThuThachInput {
  title: string;
  totalDays: number;
  flowerType: string;
}

export interface PhanHoiDanhSach {
  success: boolean;
  data: Challenge[];
}

export interface PhanHoiTaoMoi {
  success: boolean;
  message?: string;
  data: Challenge;
}

export interface PhanHoiChiTiet {
  success: boolean;
  message?: string;
  data: Challenge;
}

export async function layDanhSachThuThach(): Promise<PhanHoiDanhSach> {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đã có lỗi xảy ra khi lấy danh sách thử thách");
  }

  return response.json();
}

export async function taoThuThach(duLieu: TaoThuThachInput): Promise<PhanHoiTaoMoi> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(duLieu),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đã có lỗi xảy ra khi tạo thử thách");
  }

  return response.json();
}

export async function layChiTietThuThach(slug: string): Promise<PhanHoiChiTiet> {
  const response = await fetch(`${API_URL}/chi-tiet/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Không thể tải chi tiết thử thách");
  }

  return response.json();
}

export async function guiCheckIn(challengeId: string, duLieu: FormData): Promise<PhanHoiChiTiet> {
  const response = await fetch(`${API_URL}/${challengeId}/log`, {
    method: "POST",
    body: duLieu,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Không thể thực hiện ghi nhận check-in");
  }

  return response.json();
}

export async function xoaThuThach(challengeId: string): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${API_URL}/${challengeId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đã xảy ra lỗi khi xóa thử thách");
  }

  return response.json();
}

export interface PhanHoiDanhSachHoa {
  success: boolean;
  data: Flower[];
}

export async function layDanhSachHoa(): Promise<PhanHoiDanhSachHoa> {
  const response = await fetch(`${API_URL}/loai-hoa`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đã có lỗi xảy ra khi lấy danh sách loài hoa");
  }

  return response.json();
}
