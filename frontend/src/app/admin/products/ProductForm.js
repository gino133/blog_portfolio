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
    weight: product?.weight || '', dimensions: product?.dimensions || '',
    material: product?.material || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

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
      product ? await productsAPI.update(product._id, data) : await productsAPI.create(data);
      toast.success(product ? 'UNIT_UPDATED' : 'UNIT_CREATED');
      onSave();
    } catch (err) { toast.error(err.response?.data?.error || 'Error saving'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
        <button onClick={onCancel} className="btn btn-ghost btn-sm">← Back</button>
        <h1 className="admin-page-title">{product ? 'EDIT_UNIT' : 'NEW_UNIT'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-section-title">UNIT_DESCRIPTION</div>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="input-box" value={form.name} onChange={e => set('name',e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea className="input-box" rows={2} value={form.shortDesc} onChange={e => set('shortDesc',e.target.value)} />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Full Description *</label>
            <textarea className="input-box" rows={5} value={form.description} onChange={e => set('description',e.target.value)} required />
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">PRICING & INVENTORY</div>
          <div className="form-row form-row-3">
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Price (đ) *</label>
              <input className="input-box" type="number" value={form.price} onChange={e => set('price',e.target.value)} min="0" required />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Sale Price (đ)</label>
              <input className="input-box" type="number" value={form.salePrice} onChange={e => set('salePrice',e.target.value)} min="0" />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Stock</label>
              <input className="input-box" type="number" value={form.stock} onChange={e => set('stock',e.target.value)} min="0" />
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">TECHNICAL_SPECS</div>
          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="input-box" value={form.weight} onChange={e => set('weight',e.target.value)} placeholder="e.g. 1.24" />
            </div>
            <div className="form-group">
              <label className="form-label">Dimensions (mm)</label>
              <input className="input-box" value={form.dimensions} onChange={e => set('dimensions',e.target.value)} placeholder="90 x 90 x 112" />
            </div>
            <div className="form-group">
              <label className="form-label">Material</label>
              <input className="input-box" value={form.material} onChange={e => set('material',e.target.value)} placeholder="Al-6061-T6" />
            </div>
          </div>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <input className="input-box" value={form.category} onChange={e => set('category',e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input className="input-box" value={form.sku} onChange={e => set('sku',e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input className="input-box" value={form.tags} onChange={e => set('tags',e.target.value)} />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Image URLs (one per line)</label>
            <textarea className="input-box" rows={3} value={form.images} onChange={e => set('images',e.target.value)}
              style={{fontFamily:'var(--font-mono)',fontSize:11}} placeholder="https://..." />
          </div>
        </div>

        <div className="admin-form-card">
          <div style={{display:'flex',gap:20,alignItems:'flex-end',flexWrap:'wrap'}}>
            <div>
              <label className="form-label">Status</label>
              <select className="input-box" style={{width:'auto'}} value={form.status} onChange={e => set('status',e.target.value)}>
                <option value="active">ACTIVE</option>
                <option value="inactive">INACTIVE</option>
                <option value="out_of_stock">OUT_OF_STOCK</option>
              </select>
            </div>
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',paddingBottom:2}}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured',e.target.checked)} style={{width:14,height:14}} />
              <span style={{fontFamily:'var(--font-mono)',fontSize:11,textTransform:'uppercase',letterSpacing:'0.06em'}}>Featured Unit</span>
            </label>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'SAVING...' : product ? '↑ UPDATE_UNIT' : '↑ ADD_UNIT'}
          </button>
        </div>
      </form>
    </div>
  );
}
