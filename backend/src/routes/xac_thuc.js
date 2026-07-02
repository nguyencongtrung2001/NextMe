const express = require('express');
const router = express.Router();
const dieuKhien = require('../controllers/xac_thuc');
const { kiemTraNguoiDung } = require('../middlewares/xac_thuc_token');

// Tuyến đường xử lý Đăng Ký
router.post('/dang-ky', dieuKhien.dangKy);

// Tuyến đường xử lý Đăng Nhập
router.post('/dang-nhap', dieuKhien.dangNhap);

// Lấy thông tin cá nhân (yêu cầu đăng nhập)
router.get('/me', kiemTraNguoiDung, dieuKhien.layThongTinCaNhan);

module.exports = router;
