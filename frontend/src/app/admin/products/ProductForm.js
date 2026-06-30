'use client';
import { useState } from 'react';
import { productsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '', description: product?.description || '',
    shortDesc: product?.shortDesc || '', price: product?.price || '',
    salePrice: product?.salePrice || '', category: product?.category || '',
    tags: product?.tags?.join(', ') || '', stock: product?.stock ?? 0,
    status: product?.status || 'active', featured: product?.featured || false,
    sku: product?.sku || '', images: product?.images?.join('\n') || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = {
        ...form,
        price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: form.images.split('\n').map(u => u.trim()).filter(Boolean),
      };
      if (product) { await productsAPI.update(product._id, data); toast.success('Đã cập nhật'); }
      else { await productsAPI.create(data); toast.success('Đã tạo sản phẩm'); }
      onSave();
    } catch (err) { toast.error(err.response?.data?.error || 'Lỗi khi lưu'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{maxWidth:760}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button onClick={onCancel} className="btn btn-secondary">← Quay lại</button>
        <h1 className="page-title">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{marginBottom:16}}>
          <div className="form-group">
            <label className="form-label">Tên sản phẩm *</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="input" rows={2} value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Mô tả chi tiết *</label>
            <textarea className="input" rows={5} value={form.description} onChange={e => set('description', e.target.value)} required />
          </div>
        </div>

        <div className="card" style={{marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:14,color:'#374151'}}>Giá & Kho hàng</div>
          <div className="form-row form-row-3">
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Giá gốc (đ) *</label>
              <input className="input" type="number" value={form.price} onChange={e => set('price', e.target.value)} min="0" required />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Giá khuyến mãi (đ)</label>
              <input className="input" type="number" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} min="0" />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Tồn kho</label>
              <input className="input" type="number" value={form.stock} onChange={e => set('stock', e.target.value)} min="0" />
            </div>
          </div>
        </div>

        <div className="card" style={{marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:14,color:'#374151'}}>Phân loại & Hình ảnh</div>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Danh mục *</label>
              <input className="input" value={form.category} onChange={e => set('category', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input className="input" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="Tùy chọn" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <input className="input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Phân cách bằng dấu phẩy" />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">URL ảnh (mỗi dòng một URL)</label>
            <textarea className="input font-mono" rows={3} value={form.images} onChange={e => set('images', e.target.value)}
              placeholder="https://example.com/image1.jpg" />
          </div>
        </div>

        <div className="card" style={{marginBottom:20}}>
          <div style={{display:'flex',gap:20,alignItems:'flex-end'}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Trạng thái</label>
              <select className="input" style={{width:'auto'}} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',paddingBottom:1}}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{width:15,height:15}} />
              <span style={{fontSize:13,color:'#374151'}}>Sản phẩm nổi bật</span>
            </label>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : product ? '💾 Cập nhật' : '✓ Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
