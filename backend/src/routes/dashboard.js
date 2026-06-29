const express = require('express');
const Post = require('../models/Post');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalPosts, publishedPosts, draftPosts,
      totalProducts, activeProducts,
      totalUsers,
      postsThisMonth, postsLastMonth,
      topPosts,
      recentPosts,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      User.countDocuments(),
      Post.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Post.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Post.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views slug'),
      Post.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt'),
    ]);

    // Total views
    const viewsAgg = await Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
    const totalViews = viewsAgg[0]?.total || 0;

    // Posts per month for last 6 months
    const monthlyData = await Post.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      posts: { total: totalPosts, published: publishedPosts, draft: draftPosts, thisMonth: postsThisMonth, lastMonth: postsLastMonth },
      products: { total: totalProducts, active: activeProducts },
      users: { total: totalUsers },
      views: { total: totalViews },
      topPosts,
      recentPosts,
      monthlyData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
