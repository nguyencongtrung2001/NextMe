const express = require('express');
const router = express.Router();
const dieuKhien = require('../controllers/thu_thach');
const { kiemTraNguoiDung } = require('../middlewares/xac_thuc_token');

// Tất cả các route bên dưới đều bắt buộc đăng nhập
router.use(kiemTraNguoiDung);

router.get('/', dieuKhien.layDanhSach);
router.post('/', dieuKhien.taoThuThach);

module.exports = router;
