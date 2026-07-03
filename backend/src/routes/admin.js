const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { kiemTraNguoiDung } = require('../middlewares/xac_thuc_token');
const { kiemTraAdmin } = require('../middlewares/xac_thuc_admin');

// Tất cả các route bên dưới bắt buộc phải ĐĂNG NHẬP và có quyền ADMIN
router.use(kiemTraNguoiDung);
router.use(kiemTraAdmin);

// === STATS ===
router.get('/stats', adminController.layThongKe);

// === USERS ===
router.get('/users', adminController.layDanhSachNguoiDung);
router.post('/users', adminController.taoNguoiDung);
router.put('/users/:id', adminController.capNhatNguoiDung);
router.delete('/users/:id', adminController.xoaNguoiDung);

// === FLOWERS ===
router.get('/flowers', adminController.layDanhSachFlower);
router.post('/flowers', adminController.taoFlower);
router.put('/flowers/:id', adminController.capNhatFlower);
router.delete('/flowers/:id', adminController.xoaFlower);

// === COLOR BACKGROUNDS ===
router.get('/color-backgrounds', adminController.layDanhSachColorBackground);
router.post('/color-backgrounds', adminController.taoColorBackground);
router.put('/color-backgrounds/:id', adminController.capNhatColorBackground);
router.delete('/color-backgrounds/:id', adminController.xoaColorBackground);

module.exports = router;
