const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'BiMatCuaNextMe2026';

/**
 * [POST] Hàm Đăng Ký Tài Khoản
 */
const dangKy = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ thongBao: 'Email và mật khẩu là bắt buộc' });
    }

    // Kiểm tra xem email đã tồn tại trong hệ thống chưa
    const nguoiDungTonTai = await prisma.user.findUnique({
      where: { email },
    });

    if (nguoiDungTonTai) {
      return res.status(409).json({ thongBao: 'Email này đã được sử dụng' });
    }

    // Mã hóa mật khẩu an toàn
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Lưu vào CSDL
    const nguoiDungMoi = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || '',
      },
    });

    return res.status(201).json({
      thongBao: 'Tạo tài khoản thành công',
      nguoiDung: {
        id: nguoiDungMoi.id,
        email: nguoiDungMoi.email,
        name: nguoiDungMoi.name,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    return res.status(500).json({ thongBao: 'Lỗi hệ thống khi đăng ký' });
  }
};

/**
 * [POST] Hàm Đăng Nhập
 */
const dangNhap = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ thongBao: 'Email và mật khẩu là bắt buộc' });
    }

    // Truy xuất thông tin người dùng
    const nguoiDung = await prisma.user.findUnique({
      where: { email },
    });

    if (!nguoiDung) {
      return res.status(401).json({ thongBao: 'Sai thông tin đăng nhập' });
    }

    // Đối chiếu mật khẩu
    const matKhauDung = await bcrypt.compare(password, nguoiDung.password);
    if (!matKhauDung) {
      return res.status(401).json({ thongBao: 'Sai thông tin đăng nhập' });
    }

    // Khởi tạo chữ ký điện tử (JWT Token)
    const payload = {
      id: nguoiDung.id,
      email: nguoiDung.email,
      role: nguoiDung.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Trả Token về bằng HTTP-Only Cookie theo chuẩn bảo mật đã thống nhất
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Tồn tại trong 7 ngày
    });

    return res.status(200).json({
      thongBao: 'Đăng nhập thành công',
      nguoiDung: {
        id: nguoiDung.id,
        email: nguoiDung.email,
        name: nguoiDung.name,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({ thongBao: 'Lỗi hệ thống khi đăng nhập' });
  }
};

module.exports = {
  dangKy,
  dangNhap,
};
