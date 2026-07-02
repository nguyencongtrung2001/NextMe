const thuThachService = require('../services/thu_thach');

const layDanhSach = async (req, res) => {
  try {
    const userId = req.nguoiDung.id;
    const danhSach = await thuThachService.layDanhSachThuThach(userId);
    
    return res.status(200).json({
      success: true,
      data: danhSach,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thử thách:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống khi lấy danh sách thử thách',
    });
  }
};

const taoThuThach = async (req, res) => {
  try {
    const userId = req.nguoiDung.id;
    const { title, totalDays, flowerType } = req.body;

    const thuThachMoi = await thuThachService.taoThuThachMoi(userId, {
      title,
      totalDays,
      flowerType,
    });

    return res.status(201).json({
      success: true,
      message: 'Kích hoạt hạt giống thử thách thành công!',
      data: thuThachMoi,
    });
  } catch (error) {
    console.error('Lỗi khi tạo thử thách:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo thử thách',
    });
  }
};

module.exports = {
  layDanhSach,
  taoThuThach,
};
