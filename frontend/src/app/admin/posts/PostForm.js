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
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      post ? await postsAPI.update(post._id, data) : await postsAPI.create(data);
      toast.success(post ? 'POST_UPDATED' : 'POST_CREATED');
      onSave();
    } catch (err) { toast.error(err.response?.data?.error || 'Error saving'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
        <button onClick={onCancel} className="btn btn-ghost btn-sm">← Back</button>
        <h1 className="admin-page-title">{post ? 'EDIT_POST' : 'NEW_POST'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-section-title">CONTENT_PAYLOAD</div>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="input-box" value={form.title} onChange={e => set('title',e.target.value)} required placeholder="Post title..." />
          </div>
          <div className="form-group">
            <label className="form-label">Excerpt / Summary</label>
            <textarea className="input-box" rows={2} value={form.excerpt} onChange={e => set('excerpt',e.target.value)} placeholder="Short description..." />
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Content * (Markdown supported)</label>
            <textarea className="input-box" rows={16} value={form.content} onChange={e => set('content',e.target.value)} required
              style={{fontFamily:'var(--font-mono)',fontSize:12}} placeholder="Write content here..." />
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-section-title">METADATA</div>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="input-box" value={form.category} onChange={e => set('category',e.target.value)} placeholder="e.g. CAD_MODELING" />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input className="input-box" value={form.tags} onChange={e => set('tags',e.target.value)} placeholder="solidworks, cad, design" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="input-box" type="url" value={form.coverImage} onChange={e => set('coverImage',e.target.value)} placeholder="https://..." />
          </div>
          <div style={{display:'flex',gap:20,alignItems:'flex-end',flexWrap:'wrap'}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Status</label>
              <select className="input-box" style={{width:'auto'}} value={form.status} onChange={e => set('status',e.target.value)}>
                <option value="draft">DRAFT</option>
                <option value="published">PUBLISHED</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',paddingBottom:2}}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured',e.target.checked)} style={{width:14,height:14}} />
              <span style={{fontFamily:'var(--font-mono)',fontSize:11,textTransform:'uppercase',letterSpacing:'0.06em'}}>Featured Post</span>
            </label>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'SAVING...' : post ? '↑ UPDATE_POST' : '↑ PUBLISH_POST'}
          </button>
        </div>
      </form>
    </div>
  );
}
