const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nguoiDungRepo = require('../repositories/nguoi_dung');

const JWT_SECRET = process.env.JWT_SECRET || 'BiMatCuaNextMe2026';

/**
 * Tầng Service: Nơi chứa toàn bộ Business Logic (Mã hóa, Ký Token, Kiểm tra hợp lệ).
 * Nhận Data từ Controller, tính toán và trả Data ngược lại. Throw Error nếu có lỗi logic.
 */

const xuLyDangKy = async ({ email, password, name }) => {
  // 1. Dùng Repository kiểm tra Email
  const nguoiDungTonTai = await nguoiDungRepo.timTheoEmail(email);
  if (nguoiDungTonTai) {
    throw new Error('Email này đã được sử dụng');
  }

  // 2. Hash mật khẩu (Business logic)
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Dùng Repository tạo tài khoản mới
  const nguoiDungMoi = await nguoiDungRepo.taoNguoiDung({
    email,
    hashedPassword,
    name,
  });

  return {
    id: nguoiDungMoi.id,
    email: nguoiDungMoi.email,
    name: nguoiDungMoi.name,
  };
};

const xuLyDangNhap = async ({ email, password }) => {
  // 1. Dùng Repository tìm User
  const nguoiDung = await nguoiDungRepo.timTheoEmail(email);
  if (!nguoiDung) {
    throw new Error('Sai thông tin đăng nhập');
  }

  // 2. So khớp mật khẩu
  const matKhauDung = await bcrypt.compare(password, nguoiDung.password);
  if (!matKhauDung) {
    throw new Error('Sai thông tin đăng nhập');
  }

  // 3. Khởi tạo Payload và Ký JWT Token
  const payload = {
    id: nguoiDung.id,
    email: nguoiDung.email,
    role: nguoiDung.role,
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    nguoiDung: {
      id: nguoiDung.id,
      email: nguoiDung.email,
      name: nguoiDung.name,
    },
  };
};

const layThongTinNguoiDung = async (userId) => {
  const user = await nguoiDungRepo.timTheoId(userId);
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
};

module.exports = {
  xuLyDangKy,
  xuLyDangNhap,
  layThongTinNguoiDung,
};
