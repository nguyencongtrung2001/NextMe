require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Gọi các tuyến đường (Routes)
const tuyenDuongXacThuc = require('./routes/xac_thuc');
const tuyenDuongThuThach = require('./routes/thu_thach');
const tuyenDuongAdmin = require('./routes/admin');
const tuyenDuongColorBackground = require('./routes/color_background');

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Cấu hình CORS - Cho phép nhận Token Cookie từ Next.js
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://next-me-opal.vercel.app' // Thêm tên miền Vercel của bạn
  ],
  credentials: true, // BẮT BUỘC để nhận/gửi Cookie
}));

// Định tuyến API
app.use('/api/xac-thuc', tuyenDuongXacThuc);
app.use('/api/thu-thach', tuyenDuongThuThach);
app.use('/api/admin', tuyenDuongAdmin);
app.use('/api/color-backgrounds', tuyenDuongColorBackground);

// API kiểm tra trạng thái
app.get('/', (req, res) => {
  res.send('NextMe Backend đang chạy mượt mà...');
});

// Xử lý lỗi hệ thống (Error Handler)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ thongBao: 'Đã có lỗi xảy ra trên máy chủ' });
});

app.listen(PORT, () => {
  console.log(`🚀 Máy chủ đang chạy tại http://localhost:${PORT}`);
});
