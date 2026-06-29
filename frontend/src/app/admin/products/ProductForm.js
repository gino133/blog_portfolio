'use client';
import { useState } from 'react';
import { productsAPI } from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    shortDesc: product?.shortDesc || '',
    price: product?.price || '',
    salePrice: product?.salePrice || '',
    category: product?.category || '',
    tags: product?.tags?.join(', ') || '',
    stock: product?.stock ?? 0,
    status: product?.status || 'active',
    featured: product?.featured || false,
    sku: product?.sku || '',
    images: product?.images?.join('\n') || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: form.images.split('\n').map(u => u.trim()).filter(Boolean),
      };
      if (product) {
        await productsAPI.update(product._id, data);
        toast.success('Đã cập nhật sản phẩm');
      } else {
        await productsAPI.create(data);
        toast.success('Đã tạo sản phẩm');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lỗi khi lưu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft size={15} /> Quay lại
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên sản phẩm *</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả ngắn</label>
            <textarea value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)}
              className="input-field resize-none" rows={2} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả chi tiết *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="input-field resize-none" rows={6} required />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-medium text-gray-900">Giá & Kho hàng</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá gốc (đ) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                className="input-field" min="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá khuyến mãi (đ)</label>
              <input type="number" value={form.salePrice} onChange={e => set('salePrice', e.target.value)}
                className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tồn kho</label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
                className="input-field" min="0" />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-medium text-gray-900">Phân loại</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục *</label>
              <input type="text" value={form.category} onChange={e => set('category', e.target.value)}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
              <input type="text" value={form.sku} onChange={e => set('sku', e.target.value)}
                className="input-field" placeholder="Tùy chọn" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
              className="input-field" placeholder="Phân cách bằng dấu phẩy" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL ảnh (mỗi dòng một URL)</label>
            <textarea value={form.images} onChange={e => set('images', e.target.value)}
              className="input-field resize-none font-mono text-xs" rows={3}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
          </div>

          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="input-field w-auto">
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-700">Sản phẩm nổi bật</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary">Hủy</button>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            <Save size={15} />
            {saving ? 'Đang lưu...' : product ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
