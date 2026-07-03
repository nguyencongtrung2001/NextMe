const thuThachRepository = require('../repositories/thu_thach');
const { uploadToCloudinary, deleteCloudinaryFolder } = require('../config/cloudinary');

// Hàm helper để chuẩn hóa chuỗi tiếng Việt thành slug URL
const slugifyText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/[đĐ]/g, 'd')
    .replace(/([^a-z0-9\s-]|_)+/g, '') // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng -
    .replace(/-+/g, '-'); // Tránh nhiều ký tự - liền nhau
};

const layDanhSachThuThach = async (userId) => {
  await thuThachRepository.ensureFlowersExist();
  return await thuThachRepository.timKiemThuThachCuaUser(userId);
};

const taoThuThachMoi = async (userId, { title, totalDays, flowerType }) => {
  if (!title || !totalDays || !flowerType) {
    throw new Error('Dữ liệu đầu vào không hợp lệ!');
  }

  await thuThachRepository.ensureFlowersExist();

  const hoa = await thuThachRepository.timHoaTheoType(flowerType);
  if (!hoa) {
    throw new Error(`Loài hoa với loại "${flowerType}" không tồn tại trong hệ thống.`);
  }

  // Tính ngày bắt đầu từ ngày mai (date.now + 1 ngày)
  const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
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

const timThuThachTheoSlug = async (userId, slug) => {
  await thuThachRepository.ensureFlowersExist();
  const list = await thuThachRepository.timKiemThuThachCuaUser(userId);
  
  // Trích xuất UUID ở cuối slug nếu có (ví dụ: day-som-doc-sach-54738d8c-d94d-42e9-b9e5-0cacaae66cca)
  const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  const matchedId = uuidMatch ? uuidMatch[0] : null;

  // So khớp in-memory bằng ID, UUID trích xuất hoặc slugified title
  const found = list.find((c) => 
    c.id === slug || 
    (matchedId && c.id === matchedId) || 
    slugifyText(c.title) === slug
  );
  if (!found) {
    throw new Error('Không tìm thấy thử thách tương ứng với đường dẫn.');
  }

  // Lấy chi tiết đầy đủ của thử thách (bao gồm logs và media files)
  return await thuThachRepository.timChiTietThuThachTheoId(found.id);
};

const taoNhatKyCheckIn = async (userId, challengeId, { mood, note, files, slug }) => {
  const challenge = await thuThachRepository.timChiTietThuThachTheoId(challengeId);
  if (!challenge) {
    throw new Error('Thử thách không tồn tại.');
  }

  if (challenge.userId !== parseInt(userId)) {
    throw new Error('Bạn không có quyền thực hiện hành động này.');
  }

  if (challenge.status === 'COMPLETED') {
    throw new Error('Thử thách này đã được hoàn thành!');
  }

  // 1. Tính toán ngày hiện tại của thử thách dựa trên mốc Midnight ở múi giờ Vietnam (UTC+7)
  const getVietnamMidnight = (dateObj) => {
    const vnTime = new Date(dateObj.getTime() + (7 * 60 * 60 * 1000));
    const year = vnTime.getUTCFullYear();
    const month = vnTime.getUTCMonth();
    const day = vnTime.getUTCDate();
    return new Date(Date.UTC(year, month, day));
  };

  const startZero = getVietnamMidnight(new Date(challenge.startDate));
  const nowZero = getVietnamMidnight(new Date());
  
  const diffTime = nowZero.getTime() - startZero.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = diffDays < 0 ? 0 : Math.min(diffDays + 1, challenge.totalDays);

  if (currentDay === 0) {
    throw new Error('Thử thách chưa chính thức bắt đầu! Hãy quay lại check-in vào ngày mai.');
  }

  // 2. Kiểm tra xem hôm nay người dùng đã check-in chưa
  const nowVn = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const loggedDateStr = `${nowVn.getUTCFullYear()}-${(nowVn.getUTCMonth() + 1).toString().padStart(2, '0')}-${nowVn.getUTCDate().toString().padStart(2, '0')}`;

  const alreadyLoggedToday = challenge.historyLogs.some((log) => {
    const logDate = new Date(log.loggedDate);
    const logYear = logDate.getUTCFullYear();
    const logMonth = (logDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const logDay = logDate.getUTCDate().toString().padStart(2, '0');
    return `${logYear}-${logMonth}-${logDay}` === loggedDateStr;
  });

  if (alreadyLoggedToday) {
    throw new Error('Bạn đã check-in cho ngày hôm nay rồi!');
  }

  // 3. Upload các hình ảnh / video lên Cloudinary (nếu có)
  const mediaFilesList = [];
  if (files && files.length > 0) {
    const folderPath = `challenges/${slug || slugifyText(challenge.title)}`;
    for (const file of files) {
      const isVideo = file.mimetype.startsWith('video/');
      const resourceType = isVideo ? 'video' : 'image';
      
      const uploadResult = await uploadToCloudinary(file.buffer, folderPath, resourceType);
      
      mediaFilesList.push({
        type: isVideo ? 'VIDEO' : 'IMAGE',
        url: uploadResult.secure_url,
        name: file.originalname || 'file_attachment',
      });
    }
  }

  // 4. Tạo bản ghi HistoryLog mới
  await thuThachRepository.taoHistoryLog({
    challengeId,
    day: currentDay,
    loggedDate: loggedDateStr,
    mood: mood || 'Bình thường',
    note: note || 'Không có ghi chú.',
    mediaFiles: mediaFilesList,
  });

  // 5. Tính toán tiến độ, streak và trạng thái mới
  const nextCompletedCount = challenge.completedDaysCount + 1;
  let newStreak = 1;

  if (challenge.historyLogs.length > 0) {
    // Sắp xếp logs gần nhất lên trước
    const sortedLogs = [...challenge.historyLogs].sort(
      (a, b) => new Date(b.loggedDate).getTime() - new Date(a.loggedDate).getTime()
    );
    const lastLogZero = getVietnamMidnight(new Date(sortedLogs[0].loggedDate));
    
    // Khoảng cách ngày giữa hôm nay và ngày check-in cuối cùng
    const dayDiff = Math.floor((nowZero.getTime() - lastLogZero.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      newStreak = challenge.streak + 1;
    } else if (dayDiff === 0) {
      newStreak = challenge.streak; // Phòng trừ trường hợp log cùng ngày
    } else {
      newStreak = 1; // Bị đứt chuỗi streak
    }
  }

  const nextProgress = Math.min(Math.round((nextCompletedCount / challenge.totalDays) * 100), 100);
  const nextStatus = nextCompletedCount >= challenge.totalDays ? 'COMPLETED' : challenge.status;

  // 6. Cập nhật vào DB và trả về thông tin chi tiết đầy đủ đã cập nhật
  return await thuThachRepository.capNhatTienDoThuThach(challengeId, {
    completedDaysCount: nextCompletedCount,
    streak: newStreak,
    progress: nextProgress,
    status: nextStatus,
  });
};

const xuLyXoaThuThach = async (userId, challengeId) => {
  const challenge = await thuThachRepository.timChiTietThuThachTheoId(challengeId);
  if (!challenge) {
    throw new Error('Thử thách không tồn tại.');
  }

  if (challenge.userId !== parseInt(userId)) {
    throw new Error('Bạn không có quyền thực hiện hành động này.');
  }

  // Thư mục chứa hình ảnh/video của thử thách trên Cloudinary: challenges/[slug]
  const slug = slugifyText(challenge.title);
  const folderPath = `challenges/${slug}`;

  // 1. Xóa toàn bộ tệp đính kèm và thư mục trên Cloudinary
  await deleteCloudinaryFolder(folderPath);

  // 2. Xóa bản ghi trong CSDL (Prisma Cascade sẽ tự động xóa historyLogs và mediaFiles)
  return await thuThachRepository.xoaThuThachTheoId(challengeId);
};

const layDanhSachHoa = async () => {
  await thuThachRepository.ensureFlowersExist();
  return await thuThachRepository.timTatCaLoaiHoa();
};

const capNhatThuThach = async (userId, challengeId, { title, addDays }) => {
  const challenge = await thuThachRepository.timChiTietThuThachTheoId(challengeId);
  if (!challenge) {
    throw new Error('Thử thách không tồn tại.');
  }

  if (challenge.userId !== parseInt(userId)) {
    throw new Error('Bạn không có quyền thực hiện hành động này.');
  }

  const updateData = {};
  
  if (title && title.trim() !== '') {
    updateData.title = title.trim();
  }

  if (addDays && parseInt(addDays) > 0) {
    const parsedAddDays = parseInt(addDays);
    const newTotalDays = challenge.totalDays + parsedAddDays;
    
    // Cộng thêm ngày vào estimatedEndDate cũ
    const newEndDate = new Date(new Date(challenge.estimatedEndDate).getTime() + parsedAddDays * 24 * 60 * 60 * 1000);
    
    updateData.totalDays = newTotalDays;
    updateData.estimatedEndDate = newEndDate;
    
    // Tính lại phần trăm tiến độ
    const nextProgress = Math.min(Math.round((challenge.completedDaysCount / newTotalDays) * 100), 100);
    updateData.progress = nextProgress;
    
    // Đang hoàn thành mà được gia hạn thì Active trở lại
    if (challenge.status === 'COMPLETED' && challenge.completedDaysCount < newTotalDays) {
      updateData.status = 'ACTIVE';
    }
  }

  if (Object.keys(updateData).length === 0) {
    return challenge; // Không có gì cần update
  }

  return await thuThachRepository.capNhatTienDoThuThach(challengeId, updateData);
};

module.exports = {
  layDanhSachThuThach,
  taoThuThachMoi,
  timThuThachTheoSlug,
  taoNhatKyCheckIn,
  xuLyXoaThuThach,
  layDanhSachHoa,
  capNhatThuThach,
};
