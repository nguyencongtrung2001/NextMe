const xacThucService = require('../services/xac_thuc');

/**
 * Tầng Controller (Thin Controller):
 * Chỉ hứng Request HTTP (req.body), điều phối sang Service và trả về Response (res.json / res.cookie).
 */

const dangKy = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ thongBao: 'Email và mật khẩu là bắt buộc' });
    }

    // Đẩy toàn bộ logic xuống tầng Service
    const nguoiDung = await xacThucService.xuLyDangKy({ email, password, name });

    return res.status(201).json({
      thongBao: 'Tạo tài khoản thành công',
      nguoiDung,
    });
  } catch (error) {
    // Xử lý các lỗi nghiệp vụ do Service ném (throw) ra
    if (error.message === 'Email này đã được sử dụng') {
      return res.status(409).json({ thongBao: error.message });
    }
    console.error('Lỗi khi đăng ký:', error);
    return res.status(500).json({ thongBao: 'Lỗi hệ thống khi đăng ký' });
  }
};

const dangNhap = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ thongBao: 'Email và mật khẩu là bắt buộc' });
    }

    // Đẩy toàn bộ logic xuống tầng Service
    const ketQua = await xacThucService.xuLyDangNhap({ email, password });

    // Controller đảm nhận việc nhét Token vào HTTP-Only Cookie
    res.cookie('token', ketQua.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      thongBao: 'Đăng nhập thành công',
      nguoiDung: ketQua.nguoiDung,
    });
  } catch (error) {
    if (error.message === 'Sai thông tin đăng nhập') {
      return res.status(401).json({ thongBao: error.message });
    }
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({ thongBao: 'Lỗi hệ thống khi đăng nhập' });
  }
};

module.exports = {
  dangKy,
  dangNhap,
};
