const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'BiMatCuaNextMe2026';

/**
 * Middleware chặn các Route yêu cầu quyền Đăng nhập
 */
const kiemTraNguoiDung = (req, res, next) => {
  try {
    // Tự động bóc tách Token từ HTTP-Only Cookie nhờ cookie-parser
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ thongBao: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.' });
    }

    // Giải mã Token
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Lưu thông tin người dùng vào object Request để các API phía sau sử dụng
    req.nguoiDung = payload; 
    
    next();
  } catch (error) {
    console.error('Lỗi giải mã Token:', error);
    return res.status(403).json({ thongBao: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
};

module.exports = {
  kiemTraNguoiDung,
};
