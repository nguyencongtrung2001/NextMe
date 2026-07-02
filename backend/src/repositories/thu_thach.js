const prisma = require('../config/prisma');

const timKiemThuThachCuaUser = async (userId) => {
  return await prisma.challenge.findMany({
    where: { userId: parseInt(userId) },
    include: {
      flower: true,
      historyLogs: {
        include: {
          mediaFiles: true,
        },
        orderBy: {
          day: 'asc',
        },
      },
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

const timChiTietThuThachTheoId = async (challengeId) => {
  return await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      flower: true,
      historyLogs: {
        include: {
          mediaFiles: true,
        },
        orderBy: {
          day: 'asc',
        },
      },
    },
  });
};

const taoHistoryLog = async ({ challengeId, day, loggedDate, mood, note, mediaFiles }) => {
  return await prisma.historyLog.create({
    data: {
      challengeId,
      day: parseInt(day),
      loggedDate: new Date(loggedDate),
      mood,
      note,
      mediaFiles: {
        create: mediaFiles || [],
      },
    },
    include: {
      mediaFiles: true,
    },
  });
};

const capNhatTienDoThuThach = async (challengeId, { completedDaysCount, streak, progress, status }) => {
  return await prisma.challenge.update({
    where: { id: challengeId },
    data: {
      completedDaysCount: parseInt(completedDaysCount),
      streak: parseInt(streak),
      progress: parseInt(progress),
      status: status,
    },
    include: {
      flower: true,
      historyLogs: {
        include: {
          mediaFiles: true,
        },
        orderBy: {
          day: 'asc',
        },
      },
    },
  });
};

const xoaThuThachTheoId = async (challengeId) => {
  return await prisma.challenge.delete({
    where: { id: challengeId },
  });
};

module.exports = {
  timKiemThuThachCuaUser,
  timHoaTheoType,
  taoThuThach,
  ensureFlowersExist,
  timChiTietThuThachTheoId,
  taoHistoryLog,
  capNhatTienDoThuThach,
  xoaThuThachTheoId,
};
