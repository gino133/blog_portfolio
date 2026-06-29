'use client';
import { useState } from 'react';
import { postsAPI } from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    category: post?.category || '',
    tags: post?.tags?.join(', ') || '',
    status: post?.status || 'draft',
    featured: post?.featured || false,
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (post) {
        await postsAPI.update(post._id, data);
        toast.success('Đã cập nhật bài viết');
      } else {
        await postsAPI.create(data);
        toast.success('Đã tạo bài viết');
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
          {post ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề *</label>
            <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
              className="input-field" placeholder="Tiêu đề bài viết..." required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tóm tắt</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
              className="input-field resize-none" rows={2}
              placeholder="Mô tả ngắn gọn về bài viết..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung *</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)}
              className="input-field resize-none font-mono text-xs" rows={16}
              placeholder="Nội dung bài viết (hỗ trợ Markdown)..." required />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-medium text-gray-900">Thông tin bổ sung</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <input type="text" value={form.category} onChange={e => set('category', e.target.value)}
                className="input-field" placeholder="VD: Công nghệ" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (phân cách bằng dấu phẩy)</label>
              <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
                className="input-field" placeholder="VD: react, nextjs" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa (URL)</label>
            <input type="url" value={form.coverImage} onChange={e => set('coverImage', e.target.value)}
              className="input-field" placeholder="https://..." />
          </div>

          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="input-field w-auto">
                <option value="draft">Nháp</option>
                <option value="published">Xuất bản</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-700">Bài viết nổi bật</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary">Hủy</button>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            <Save size={15} />
            {saving ? 'Đang lưu...' : post ? 'Cập nhật' : 'Tạo bài viết'}
          </button>
        </div>
      </form>
    </div>
  );
}
