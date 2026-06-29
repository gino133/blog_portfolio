'use client';
import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '@/lib/api';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import PostForm from './PostForm';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null=list, 'new'=create, post=edit

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postsAPI.adminGetAll({ page, limit: 15, search, status });
      setPosts(res.data.posts);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      toast.error('Lỗi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa bài viết này?')) return;
    try {
      await postsAPI.delete(id);
      toast.success('Đã xóa');
      fetchPosts();
    } catch {
      toast.error('Lỗi khi xóa');
    }
  };

  if (editing !== null) {
    return (
      <PostForm
        post={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); fetchPosts(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bài viết</h1>
          <p className="text-sm text-gray-500">{total} bài viết</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tạo mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Tìm kiếm bài viết..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="input-field w-auto">
          <option value="">Tất cả trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">Chưa có bài viết nào</p>
            <button onClick={() => setEditing('new')} className="btn-primary mt-3 text-sm">
              Tạo bài viết đầu tiên
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Ngày tạo</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                    {post.views > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Eye size={11} />{post.views} lượt xem
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{post.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge-${post.status}`}>
                      {post.status === 'published' ? 'Xuất bản' : post.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                    {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(post)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(post._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === i + 1 ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
