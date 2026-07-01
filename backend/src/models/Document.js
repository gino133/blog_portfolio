const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  docId: { type: String, trim: true },
  ref: { type: String, trim: true },
  type: { type: String, enum: ['PDF', 'DWG', 'STEP', 'MANUAL', 'REPORT', 'OTHER'], default: 'PDF' },
  version: { type: String, default: 'V1.0' },
  fileUrl: { type: String },
  category: { type: String, trim: true },
  isPublic: { type: Boolean, default: true },
  downloads: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

documentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Document', documentSchema);
