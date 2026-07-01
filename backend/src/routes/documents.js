const express = require('express');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/documents — public (isPublic only)
router.get('/', async (req, res) => {
  try {
    const { limit = 20, category, type } = req.query;
    const query = { isPublic: true };
    if (category) query.category = category;
    if (type) query.type = type;

    const [documents, total] = await Promise.all([
      Document.find(query).sort({ createdAt: -1 }).limit(Number(limit)),
      Document.countDocuments(query),
    ]);
    res.json({ documents, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/documents/admin/all — protected
router.get('/admin/all', protect, async (req, res) => {
  try {
    const { limit = 30, category, type } = req.query;
    const query = {};
    if (category) query.category = category;
    if (type) query.type = type;

    const [documents, total] = await Promise.all([
      Document.find(query).sort({ createdAt: -1 }).limit(Number(limit)),
      Document.countDocuments(query),
    ]);
    res.json({ documents, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/documents
router.post('/', protect, async (req, res) => {
  try {
    const doc = await Document.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ document: doc });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/documents/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json({ document: doc });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/documents/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
