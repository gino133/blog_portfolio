const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, trim: true, maxlength: 300 },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  category: { type: String, trim: true, default: 'Chung' },
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
}, { timestamps: true });

// Auto generate slug
postSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true, locale: 'vi' }) +
      '-' + Date.now().toString(36);
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for search performance
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ slug: 1 });
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
