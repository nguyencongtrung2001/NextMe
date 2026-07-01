const { PrismaClient } = require('@prisma/client');

// Khởi tạo và ép Prisma đọc chính xác biến môi trường DATABASE_URL
const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;