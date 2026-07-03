const prisma = require('../config/prisma');

// === USER CRUD ===
const layTatCaNguoiDung = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

const taoNguoiDung = async (duLieu) => {
  return await prisma.user.create({
    data: duLieu,
  });
};

const capNhatNguoiDung = async (id, duLieu) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: duLieu,
  });
};

const xoaNguoiDung = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};

// === FLOWER CRUD ===
const layTatCaFlower = async () => {
  return await prisma.flower.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const taoFlower = async (duLieu) => {
  return await prisma.flower.create({
    data: duLieu,
  });
};

const capNhatFlower = async (id, duLieu) => {
  return await prisma.flower.update({
    where: { id: parseInt(id) },
    data: duLieu,
  });
};

const xoaFlower = async (id) => {
  return await prisma.flower.delete({
    where: { id: parseInt(id) },
  });
};

// === COLOR BACKGROUND CRUD ===
const layTatCaColorBackground = async () => {
  return await prisma.colorBackground.findMany({
    orderBy: { createdAt: 'asc' },
  });
};

const taoColorBackground = async (duLieu) => {
  return await prisma.colorBackground.create({
    data: duLieu,
  });
};

const capNhatColorBackground = async (id, duLieu) => {
  return await prisma.colorBackground.update({
    where: { id: parseInt(id) },
    data: duLieu,
  });
};

const xoaColorBackground = async (id) => {
  return await prisma.colorBackground.delete({
    where: { id: parseInt(id) },
  });
};

// === SYSTEM STATS ===
const layThongKeHeThong = async () => {
  const tongUser = await prisma.user.count();
  const tongThuThach = await prisma.challenge.count();
  const tongThuThachHoanThanh = await prisma.challenge.count({
    where: { status: 'COMPLETED' },
  });
  const tongNhatKyCheckin = await prisma.historyLog.count();
  
  // Tính trung bình streak
  const aggregateStreak = await prisma.challenge.aggregate({
    _avg: {
      streak: true,
    },
  });

  return {
    tongUser,
    tongThuThach,
    tongThuThachHoanThanh,
    tongNhatKyCheckin,
    streakTrungBinh: Math.round((aggregateStreak._avg.streak || 0) * 10) / 10,
  };
};

module.exports = {
  layTatCaNguoiDung,
  taoNguoiDung,
  capNhatNguoiDung,
  xoaNguoiDung,
  layTatCaFlower,
  taoFlower,
  capNhatFlower,
  xoaFlower,
  layTatCaColorBackground,
  taoColorBackground,
  capNhatColorBackground,
  xoaColorBackground,
  layThongKeHeThong,
};
