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

// Cấu hình CORS - Cho phép nhận Token Cookie từ Next.js với dynamic origins cho Vercel preview
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = origin === 'http://localhost:3000' || 
                      origin === 'https://next-me-opal.vercel.app' || 
                      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
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

// API Health Check chống ngủ đông (Render)
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Xử lý lỗi hệ thống (Error Handler)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ thongBao: 'Đã có lỗi xảy ra trên máy chủ' });
});

app.listen(PORT, () => {
  console.log(`🚀 Máy chủ đang chạy tại http://localhost:${PORT}`);
});
