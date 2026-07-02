const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Cấu hình thông số kết nối Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình lưu trữ file trung gian trong RAM bằng memoryStorage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Giới hạn kích thước file tải lên tối đa 20MB (tiện cho video ngắn)
  },
});

/**
 * Hàm helper tải buffer của file lên Cloudinary
 * @param {Buffer} fileBuffer - Buffer dữ liệu file
 * @param {string} folderPath - Đường dẫn thư mục lưu trên Cloudinary (vd: challenges/day-som-doc-sach/)
 * @param {string} resourceType - Loại tài nguyên ('image', 'video', hoặc 'auto')
 * @returns {Promise<object>} Kết quả upload trả về từ Cloudinary
 */
const uploadToCloudinary = (fileBuffer, folderPath, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteCloudinaryFolder = async (folderPath) => {
  try {
    // 1. Xóa toàn bộ hình ảnh trong folder
    await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'image' });
    
    // 2. Xóa toàn bộ video trong folder
    await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'video' });
    
    // 3. Xóa thư mục rỗng
    await cloudinary.api.delete_folder(folderPath);
    console.log(`Đã dọn dẹp xong thư mục trên Cloudinary: ${folderPath}`);
  } catch (error) {
    console.warn(`Thông báo dọn dẹp Cloudinary:`, error.message || error);
  }
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteCloudinaryFolder,
};
