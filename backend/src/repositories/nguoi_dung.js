const prisma = require('../config/prisma');
/**
 * Tầng Repository: Chỉ chịu trách nhiệm giao tiếp với Database (Prisma).
 * Tuyệt đối không chứa logic mã hóa hay bắt lỗi HTTP ở đây.
 */

const timTheoEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const taoNguoiDung = async ({ email, hashedPassword, name }) => {
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || '',
    },
  });
};

module.exports = {
  timTheoEmail,
  taoNguoiDung,
};
