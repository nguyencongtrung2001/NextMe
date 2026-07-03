const adminService = require('../services/admin');

// === USER CONTROLLER ===
const layDanhSachNguoiDung = async (req, res) => {
  try {
    const data = await adminService.layTatCaNguoiDung();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const taoNguoiDung = async (req, res) => {
  try {
    const data = await adminService.taoNguoiDungMoi(req.body);
    return res.status(201).json({ success: true, message: 'Tạo tài khoản thành công!', data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const capNhatNguoiDung = async (req, res) => {
  try {
    const data = await adminService.capNhatNguoiDung(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Cập nhật tài khoản thành công!', data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const xoaNguoiDung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id === req.nguoiDung.id) {
      return res.status(400).json({ success: false, message: 'Bạn không thể tự xóa tài khoản của chính mình!' });
    }
    await adminService.xoaNguoiDung(id);
    return res.status(200).json({ success: true, message: 'Xóa tài khoản thành công!' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// === FLOWER CONTROLLER ===
const layDanhSachFlower = async (req, res) => {
  try {
    const data = await adminService.layTatCaFlower();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const taoFlower = async (req, res) => {
  try {
    const data = await adminService.taoFlowerMoi(req.body);
    return res.status(201).json({ success: true, message: 'Tạo loài hoa thành công!', data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const capNhatFlower = async (req, res) => {
  try {
    const data = await adminService.capNhatFlower(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Cập nhật loài hoa thành công!', data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const xoaFlower = async (req, res) => {
  try {
    await adminService.xoaFlower(req.params.id);
    return res.status(200).json({ success: true, message: 'Xóa loài hoa thành công!' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// === COLOR BACKGROUND CONTROLLER ===
const layDanhSachColorBackground = async (req, res) => {
  try {
    const data = await adminService.layTatCaColorBackground();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const taoColorBackground = async (req, res) => {
  try {
    const data = await adminService.taoColorBackgroundMoi(req.body);
    return res.status(201).json({ success: true, message: 'Tạo tông màu thành công!', data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const capNhatColorBackground = async (req, res) => {
  try {
    const data = await adminService.capNhatColorBackground(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Cập nhật tông màu thành công!', data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const xoaColorBackground = async (req, res) => {
  try {
    await adminService.xoaColorBackground(req.params.id);
    return res.status(200).json({ success: true, message: 'Xóa tông màu thành công!' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// === STATS CONTROLLER ===
const layThongKe = async (req, res) => {
  try {
    const data = await adminService.layThongKeHeThong();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  layDanhSachNguoiDung,
  taoNguoiDung,
  capNhatNguoiDung,
  xoaNguoiDung,
  layDanhSachFlower,
  taoFlower,
  capNhatFlower,
  xoaFlower,
  layDanhSachColorBackground,
  taoColorBackground,
  capNhatColorBackground,
  xoaColorBackground,
  layThongKe,
};
