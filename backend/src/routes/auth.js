const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
    if (!user.isActive) {
      return res.status(401).json({ error: 'Tài khoản đã bị vô hiệu hóa' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      token: signToken(user._id),
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/create-user (admin only)
router.post('/create-user', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email đã tồn tại' });
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/seed-admin (first time setup — disable after use)
router.post('/seed-admin', async (req, res) => {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return res.status(400).json({ error: 'Admin đã tồn tại' });
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });
    res.status(201).json({ message: 'Tạo admin thành công', user: admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
