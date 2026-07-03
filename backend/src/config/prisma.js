// src/config/prisma.js
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

// 1. Khởi tạo Connection Pool từ thư viện pg thuần
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Khi chạy trên Cloud như Render, đôi khi bạn cần bật SSL cho PostgreSQL
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// 2. Bọc pool trong Adapter của Prisma
const adapter = new PrismaPg(pool);

// 3. Khởi tạo Prisma Client với Adapter
const prisma = global.prisma || new PrismaClient({ adapter });
if (!process.env.DATABASE_URL) {
  console.error('❌ CẢNH BÁO: Biến môi trường DATABASE_URL chưa được thiết lập!');
}
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

module.exports = prisma;