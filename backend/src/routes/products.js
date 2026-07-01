const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/products — public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, featured } = req.query;
    const query = { status: 'active' };
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) query.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:slug — public single
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/admin/all — protected
router.get('/admin/all', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Product.countDocuments(query),
    ]);
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ product });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'SKU đã tồn tại' });
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
