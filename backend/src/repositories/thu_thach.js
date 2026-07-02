const prisma = require('../config/prisma');

const timKiemThuThachCuaUser = async (userId) => {
  return await prisma.challenge.findMany({
    where: { userId: parseInt(userId) },
    include: {
      flower: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const timHoaTheoType = async (type) => {
  return await prisma.flower.findUnique({
    where: { type },
  });
};

const taoThuThach = async (duLieu) => {
  return await prisma.challenge.create({
    data: {
      title: duLieu.title,
      totalDays: parseInt(duLieu.totalDays),
      startDate: duLieu.startDate,
      estimatedEndDate: duLieu.estimatedEndDate,
      userId: parseInt(duLieu.userId),
      flowerId: duLieu.flowerId,
      status: 'ACTIVE', // Mặc định khi tạo mới
    },
    include: {
      flower: true,
    },
  });
};

const ensureFlowersExist = async () => {
  const count = await prisma.flower.count();
  if (count === 0) {
    const macDinh = [
      { nameFlower: 'Hướng Dương', type: 'sunflower', emoji: '🌻', color: 'var(--amber)' },
      { nameFlower: 'Oải Hương', type: 'lavender', emoji: '🪻', color: 'var(--sage)' },
      { nameFlower: 'Tulip', type: 'tulip', emoji: '🌷', color: 'var(--rose)' },
    ];
    
    await prisma.flower.createMany({
      data: macDinh,
      skipDuplicates: true,
    });
  }
};

module.exports = {
  timKiemThuThachCuaUser,
  timHoaTheoType,
  taoThuThach,
  ensureFlowersExist,
};
