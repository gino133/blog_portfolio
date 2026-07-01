const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDesc: { type: String, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  currency: { type: String, default: 'VND' },
  images: [{ type: String }],
  category: { type: String, trim: true, required: true },
  tags: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
  featured: { type: Boolean, default: false },
  orders: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  sku: { type: String, unique: true, sparse: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: 'vi' }) +
      '-' + Date.now().toString(36);
  }
  next();
});

productSchema.index({ status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
