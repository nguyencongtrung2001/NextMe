const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";
const API_URL = `${BACKEND_URL}/api/admin`;

export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface AdminFlower {
  id: number;
  nameFlower: string;
  type: string;
  emoji: string;
  color: string;
  createdAt: string;
}

export interface AdminColorBackground {
  id: number;
  name: string;
  type: string;
  lightBg: string;
  lightBorder: string;
  lightText: string;
  lightSoft: string;
  darkBg: string;
  darkBorder: string;
  darkText: string;
  darkSoft: string;
  createdAt: string;
}

export interface AdminStats {
  tongUser: number;
  tongThuThach: number;
  tongThuThachHoanThanh: number;
  tongNhatKyCheckin: number;
  streakTrungBinh: number;
}

// Helper fetch với Cookie Credentials
async function request<T>(path: string, options?: RequestInit): Promise<{ success: boolean; data?: T; message?: string }> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.message || "Lỗi xử lý yêu cầu quản trị");
  }
  return resJson;
}

// === USERS ===
export async function layDanhSachUsers() {
  return request<AdminUser[]>("/users");
}

export async function taoUser(duLieu: Partial<AdminUser> & { password?: string }) {
  return request<AdminUser>("/users", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}

export async function capNhatUser(id: number, duLieu: Partial<AdminUser> & { password?: string }) {
  return request<AdminUser>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}

export async function xoaUser(id: number) {
  return request<{ success: boolean }>(`/users/${id}`, {
    method: "DELETE",
  });
}

// === FLOWERS ===
export async function layDanhSachFlowers() {
  return request<AdminFlower[]>("/flowers");
}

export async function taoFlower(duLieu: Partial<AdminFlower>) {
  return request<AdminFlower>("/flowers", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}

export async function capNhatFlower(id: number, duLieu: Partial<AdminFlower>) {
  return request<AdminFlower>(`/flowers/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}

export async function xoaFlower(id: number) {
  return request<{ success: boolean }>(`/flowers/${id}`, {
    method: "DELETE",
  });
}

// === COLOR BACKGROUNDS ===
export async function layDanhSachColorBackgrounds() {
  return request<AdminColorBackground[]>("/color-backgrounds");
}

export async function taoColorBackground(duLieu: Partial<AdminColorBackground>) {
  return request<AdminColorBackground>("/color-backgrounds", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}

export async function capNhatColorBackground(id: number, duLieu: Partial<AdminColorBackground>) {
  return request<AdminColorBackground>(`/color-backgrounds/${id}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}

export async function xoaColorBackground(id: number) {
  return request<{ success: boolean }>(`/color-backgrounds/${id}`, {
    method: "DELETE",
  });
}

// === STATS ===
export async function layStats() {
  return request<AdminStats>("/stats");
}
