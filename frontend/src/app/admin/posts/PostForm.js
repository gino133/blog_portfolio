'use client';
import { useState } from 'react';
import { postsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PostForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || '', excerpt: post?.excerpt || '',
    content: post?.content || '', coverImage: post?.coverImage || '',
    category: post?.category || '', tags: post?.tags?.join(', ') || '',
    status: post?.status || 'draft', featured: post?.featured || false,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (post) { await postsAPI.update(post._id, data); toast.success('Đã cập nhật'); }
      else { await postsAPI.create(data); toast.success('Đã tạo bài viết'); }
      onSave();
    } catch (err) { toast.error(err.response?.data?.error || 'Lỗi khi lưu'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{maxWidth:760}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button onClick={onCancel} className="btn btn-secondary">← Quay lại</button>
        <h1 className="page-title">{post ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{marginBottom:16}}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Tiêu đề bài viết..." required />
          </div>
          <div className="form-group">
            <label className="form-label">Tóm tắt</label>
            <textarea className="input" rows={2} value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)} placeholder="Mô tả ngắn gọn..." />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Nội dung *</label>
            <textarea className="input font-mono" rows={14} value={form.content}
              onChange={e => set('content', e.target.value)} placeholder="Nội dung (hỗ trợ Markdown)..." required />
          </div>
        </div>

        <div className="card" style={{marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:14,color:'#374151'}}>Thông tin bổ sung</div>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <input className="input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="VD: Công nghệ" />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
              <input className="input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="react, nextjs..." />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh bìa (URL)</label>
            <input className="input" type="url" value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)} placeholder="https://..." />
          </div>
          <div style={{display:'flex',gap:20,alignItems:'flex-end'}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Trạng thái</label>
              <select className="input" style={{width:'auto'}} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Nháp</option>
                <option value="published">Xuất bản</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',paddingBottom:1}}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                style={{width:15,height:15}} />
              <span style={{fontSize:13,color:'#374151'}}>Bài viết nổi bật</span>
            </label>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : post ? '💾 Cập nhật' : '✓ Tạo bài viết'}
          </button>
        </div>
      </form>
    </div>
  );
}
