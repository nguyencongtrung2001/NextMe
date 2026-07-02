const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";
const API_URL = `${BACKEND_URL}/api/thu-thach`;

export interface Flower {
  id: number;
  nameFlower: string;
  type: "sunflower" | "lavender" | "tulip";
  color: string;
  emoji: string;
  createdAt: string;
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
}

export interface TaoThuThachInput {
  title: string;
  totalDays: number;
  flowerType: "sunflower" | "lavender" | "tulip";
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

export async function layDanhSachThuThach(): Promise<PhanHoiDanhSach> {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Quan trọng để gửi kèm Token Cookie
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
    credentials: "include", // Quan trọng để gửi kèm Token Cookie
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đã có lỗi xảy ra khi tạo thử thách");
  }
  
  return response.json();
}
