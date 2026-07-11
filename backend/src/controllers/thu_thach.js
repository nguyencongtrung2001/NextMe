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

const layChiTiet = async (req, res) => {
  try {
    const userId = req.nguoiDung.id;
    const { slug } = req.params;

    const thuThach = await thuThachService.timThuThachTheoSlug(userId, slug);

    return res.status(200).json({
      success: true,
      data: thuThach,
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết thử thách:', error);
    return res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy thử thách',
    });
  }
};

const checkInHangNgay = async (req, res) => {
  try {
    const userId = req.nguoiDung.id;
    const challengeId = req.params.id;
    const { mood, note, slug } = req.body;
    const files = req.files; // Được inject bởi multer middleware

    const thuThachCapNhat = await thuThachService.taoNhatKyCheckIn(userId, challengeId, {
      mood,
      note,
      files,
      slug,
    });

    return res.status(200).json({
      success: true,
      message: 'Tick hoàn thành ngày hôm nay thành công!',
      data: thuThachCapNhat,
    });
  } catch (error) {
    console.error('Lỗi khi check-in:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi ghi nhật ký check-in',
    });
  }
};

const xoaThuThach = async (req, res) => {
  try {
    const userId = req.nguoiDung.id;
    const challengeId = req.params.id;

    await thuThachService.xuLyXoaThuThach(userId, challengeId);

    return res.status(200).json({
      success: true,
      message: 'Xóa thử thách và dọn dẹp dữ liệu đính kèm thành công!',
    });
  } catch (error) {
    console.error('Lỗi khi xóa thử thách:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi xóa thử thách',
    });
  }
};

const layDanhSachHoa = async (req, res) => {
  try {
    const hoa = await thuThachService.layDanhSachHoa();
    return res.status(200).json({
      success: true,
      data: hoa,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loài hoa:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách loài hoa',
    });
  }
};

const capNhatThuThach = async (req, res) => {
  try {
    const userId = req.nguoiDung.id;
    const challengeId = req.params.id;
    const { title, totalDays } = req.body;

    const thuThachCapNhat = await thuThachService.capNhatThuThach(userId, challengeId, {
      title,
      totalDays,
    });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thử thách thành công!',
      data: thuThachCapNhat,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật thử thách:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thử thách',
    });
  }
};

module.exports = {
  layDanhSach,
  taoThuThach,
  layChiTiet,
  checkInHangNgay,
  xoaThuThach,
  layDanhSachHoa,
  capNhatThuThach,
};
