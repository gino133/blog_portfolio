const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts — public listing
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, featured } = req.query;
    const query = { status: 'published' };
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) query.$text = { $search: search };

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name avatar')
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-content'),
      Post.countDocuments(query),
    ]);

    res.json({ posts, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:slug — public single post
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar');
    if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });
    post.views += 1;
    await post.save({ validateBeforeSave: false });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin routes (protected) ───────────────────────────────────────────────

// GET /api/posts/admin/all
router.get('/admin/all', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-content'),
      Post.countDocuments(query),
    ]);
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts
router.post('/', protect, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json({ post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/posts/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!post) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    res.json({ post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa bài viết' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
