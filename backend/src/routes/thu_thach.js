const express = require('express');
const router = express.Router();
const dieuKhien = require('../controllers/thu_thach');
const { kiemTraNguoiDung } = require('../middlewares/xac_thuc_token');
const { upload } = require('../config/cloudinary');

// Tất cả các route bên dưới đều bắt buộc đăng nhập
router.use(kiemTraNguoiDung);

router.get('/', dieuKhien.layDanhSach);
router.post('/', dieuKhien.taoThuThach);

// Lấy chi tiết thử thách theo URL slug
router.get('/chi-tiet/:slug', dieuKhien.layChiTiet);

// Tick check-in tích lũy ngày mới kèm theo upload ảnh / video (tối đa 5 file)
router.post('/:id/log', upload.array('mediaFiles', 5), dieuKhien.checkInHangNgay);

module.exports = router;
