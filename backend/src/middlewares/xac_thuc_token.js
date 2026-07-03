const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'BiMatCuaNextMe2026';

/**
 * Middleware chặn các Route yêu cầu quyền Đăng nhập
 */
const kiemTraNguoiDung = async (req, res, next) => {
  try {
    // Tự động bóc tách Token từ HTTP-Only Cookie nhờ cookie-parser
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ thongBao: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.' });
    }

    // Giải mã Token
    const payload = jwt.verify(token, JWT_SECRET);
    
    // TRUY VẤN DATABASE để lấy thông tin ĐÚNG và MỚI NHẤT (Chống lỗi cache role cũ)
    const userRealTime = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!userRealTime) {
      return res.status(404).json({ thongBao: 'Tài khoản không tồn tại!' });
    }

    // Lưu thông tin người dùng real-time từ DB vào object Request
    req.nguoiDung = {
      id: userRealTime.id,
      email: userRealTime.email,
      name: userRealTime.name,
      role: userRealTime.role // Lúc này chắc chắn sẽ lấy role mới nhất từ CSDL
    }; 
    
    next();
  } catch (error) {
    console.error('Lỗi giải mã Token:', error);
    return res.status(403).json({ thongBao: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
};

module.exports = {
  kiemTraNguoiDung,
};
