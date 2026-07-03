const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Endpoint công khai lấy danh sách tông màu CSDL
router.get('/', async (req, res) => {
  try {
    // Tự động kiểm tra nếu bảng rỗng thì nạp dữ liệu mẫu ban đầu (Seeding)
    const count = await prisma.colorBackground.count();
    if (count === 0) {
      const macDinh = [
        {
          name: "Ocean Blue",
          type: "blue",
          lightBg: "#EFF6FF",
          lightBorder: "#BFDBFE",
          lightText: "#2563EB",
          lightSoft: "#3B82F6",
          darkBg: "#172554",
          darkBorder: "#1E3A8A",
          darkText: "#3B82F6",
          darkSoft: "#60A5FA",
        },
        {
          name: "Moss Green",
          type: "moss",
          lightBg: "#F2FAF0",
          lightBorder: "#D4EFCA",
          lightText: "#58973A",
          lightSoft: "#91D172",
          darkBg: "#1B3310",
          darkBorder: "#2E521D",
          darkText: "#91D172",
          darkSoft: "#A5DC8C",
        },
        {
          name: "Ice Blue",
          type: "ice",
          lightBg: "#F4F7FC",
          lightBorder: "#D5E0F2",
          lightText: "#5471A8",
          lightSoft: "#ACBEE4",
          darkBg: "#182338",
          darkBorder: "#2B3B57",
          darkText: "#ACBEE4",
          darkSoft: "#C3D2ED",
        },
        {
          name: "Slate Blue",
          type: "slate",
          lightBg: "#F0F4FC",
          lightBorder: "#CDDAF2",
          lightText: "#4B68A0",
          lightSoft: "#86A0D7",
          darkBg: "#1B2A47",
          darkBorder: "#2F4469",
          darkText: "#86A0D7",
          darkSoft: "#A5BBE4",
        },
        {
          name: "Olive Gold",
          type: "olive",
          lightBg: "#F8FAE6",
          lightBorder: "#E6EDBA",
          lightText: "#788725",
          lightSoft: "#AFC44D",
          darkBg: "#252B0B",
          darkBorder: "#3E4717",
          darkText: "#AFC44D",
          darkSoft: "#C3D56D",
        },
        {
          name: "Bronze Taupe",
          type: "bronze",
          lightBg: "#F7F6F0",
          lightBorder: "#DDD9C6",
          lightText: "#706846",
          lightSoft: "#92875C",
          darkBg: "#282517",
          darkBorder: "#423E28",
          darkText: "#92875C",
          darkSoft: "#ABA27B",
        }
      ];
      await prisma.colorBackground.createMany({ data: macDinh });
    }

    const list = await prisma.colorBackground.findMany({
      orderBy: { id: 'asc' },
    });
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tông màu:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
