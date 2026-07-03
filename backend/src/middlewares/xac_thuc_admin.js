const kiemTraAdmin = (req, res, next) => {
  if (!req.nguoiDung) {
    return res.status(401).json({ thongBao: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.' });
  }

  if (req.nguoiDung.role !== 'ADMIN') {
    return res.status(403).json({ thongBao: 'Quyền truy cập bị từ chối. Bạn không phải là quản trị viên.' });
  }

  next();
};

module.exports = {
  kiemTraAdmin,
};
