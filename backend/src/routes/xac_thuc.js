const express = require('express');
const router = express.Router();
const dieuKhien = require('../controllers/xac_thuc');

// Tuyến đường xử lý Đăng Ký
router.post('/dang-ky', dieuKhien.dangKy);

// Tuyến đường xử lý Đăng Nhập
router.post('/dang-nhap', dieuKhien.dangNhap);

module.exports = router;
