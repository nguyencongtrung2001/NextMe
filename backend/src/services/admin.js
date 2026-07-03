const bcrypt = require('bcrypt');
const adminRepository = require('../repositories/admin');

// === USER CRUD ===
const layTatCaNguoiDung = async () => {
  return await adminRepository.layTatCaNguoiDung();
};

const taoNguoiDungMoi = async ({ email, name, password, role }) => {
  if (!email || !password) {
    throw new Error('Email và Mật khẩu là bắt buộc!');
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await adminRepository.taoNguoiDung({
    email,
    name,
    password: hashedPassword,
    role: role || 'USER',
  });
};

const capNhatNguoiDung = async (id, { email, name, password, role }) => {
  const dataToUpdate = {};
  if (email !== undefined) dataToUpdate.email = email;
  if (name !== undefined) dataToUpdate.name = name;
  if (role !== undefined) dataToUpdate.role = role;
  
  if (password) {
    const salt = await bcrypt.genSalt(10);
    dataToUpdate.password = await bcrypt.hash(password, salt);
  }

  return await adminRepository.capNhatNguoiDung(id, dataToUpdate);
};

const xoaNguoiDung = async (id) => {
  return await adminRepository.xoaNguoiDung(id);
};

// === FLOWER CRUD ===
const layTatCaFlower = async () => {
  return await adminRepository.layTatCaFlower();
};

const taoFlowerMoi = async (duLieu) => {
  if (!duLieu.nameFlower || !duLieu.type || !duLieu.emoji || !duLieu.color) {
    throw new Error('Tất cả các trường loài hoa là bắt buộc!');
  }
  return await adminRepository.taoFlower(duLieu);
};

const capNhatFlower = async (id, duLieu) => {
  return await adminRepository.capNhatFlower(id, duLieu);
};

const xoaFlower = async (id) => {
  return await adminRepository.xoaFlower(id);
};

// === COLOR BACKGROUND CRUD ===
const layTatCaColorBackground = async () => {
  return await adminRepository.layTatCaColorBackground();
};

const taoColorBackgroundMoi = async (duLieu) => {
  if (!duLieu.name || !duLieu.type) {
    throw new Error('Tên và loại màu sắc là bắt buộc!');
  }
  return await adminRepository.taoColorBackground(duLieu);
};

const capNhatColorBackground = async (id, duLieu) => {
  return await adminRepository.capNhatColorBackground(id, duLieu);
};

const xoaColorBackground = async (id) => {
  return await adminRepository.xoaColorBackground(id);
};

// === STATS ===
const layThongKeHeThong = async () => {
  return await adminRepository.layThongKeHeThong();
};

module.exports = {
  layTatCaNguoiDung,
  taoNguoiDungMoi,
  capNhatNguoiDung,
  xoaNguoiDung,
  layTatCaFlower,
  taoFlowerMoi,
  capNhatFlower,
  xoaFlower,
  layTatCaColorBackground,
  taoColorBackgroundMoi,
  capNhatColorBackground,
  xoaColorBackground,
  layThongKeHeThong,
};
