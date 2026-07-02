const thuThachRepository = require('../repositories/thu_thach');

const layDanhSachThuThach = async (userId) => {
  await thuThachRepository.ensureFlowersExist();
  return await thuThachRepository.timKiemThuThachCuaUser(userId);
};

const taoThuThachMoi = async (userId, { title, totalDays, flowerType }) => {
  if (!title || !totalDays || !flowerType) {
    throw new Error('Dữ liệu đầu vào không hợp lệ!');
  }

  // Đảm bảo hoa tồn tại trước khi tìm kiếm
  await thuThachRepository.ensureFlowersExist();

  const hoa = await thuThachRepository.timHoaTheoType(flowerType);
  if (!hoa) {
    throw new Error(`Loài hoa với loại "${flowerType}" không tồn tại trong hệ thống.`);
  }

  // Tính ngày bắt đầu từ ngày mai (date.now + 1 ngày)
  const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  // Tính ngày kết thúc ước tính dựa vào ngày bắt đầu + tổng số ngày
  const estimatedEndDate = new Date(startDate.getTime() + parseInt(totalDays) * 24 * 60 * 60 * 1000);

  return await thuThachRepository.taoThuThach({
    title,
    totalDays,
    startDate,
    estimatedEndDate,
    userId,
    flowerId: hoa.id,
  });
};

module.exports = {
  layDanhSachThuThach,
  taoThuThachMoi,
};
