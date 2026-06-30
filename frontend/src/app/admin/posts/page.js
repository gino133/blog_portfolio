'use client';
import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '@/lib/api';
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
  const [editing, setEditing] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postsAPI.adminGetAll({ page, limit: 15, search, status });
      setPosts(res.data.posts);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch { toast.error('Lỗi tải danh sách bài viết'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa bài viết này?')) return;
    try { await postsAPI.delete(id); toast.success('Đã xóa'); fetchPosts(); }
    catch { toast.error('Lỗi khi xóa'); }
  };

  if (editing !== null) {
    return <PostForm post={editing === 'new' ? null : editing}
      onSave={() => { setEditing(null); fetchPosts(); }} onCancel={() => setEditing(null)} />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bài viết</h1>
          <p className="page-subtitle">{total} bài viết trong hệ thống</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary">
          + Tạo bài viết
        </button>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <div className="input-group" style={{flex:1,minWidth:200}}>
          <span className="icon">🔍</span>
          <input className="input input-search" placeholder="Tìm kiếm bài viết..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input" style={{width:'auto'}} value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Nháp</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div style={{padding:'40px',textAlign:'center',color:'#9ca3af'}}>Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:40,marginBottom:12}}>✎</div>
            <p>Chưa có bài viết nào</p>
            <button onClick={() => setEditing('new')} className="btn btn-primary">Tạo bài viết đầu tiên</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th className="hide-mobile">Danh mục</th>
                <th>Trạng thái</th>
                <th className="hide-mobile">Lượt xem</th>
                <th style={{textAlign:'right'}}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td>
                    <div style={{fontWeight:500,color:'#111827',maxWidth:280,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</div>
                    {post.category && <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>{post.category}</div>}
                  </td>
                  <td className="hide-mobile" style={{color:'#6b7280'}}>{post.category || '—'}</td>
                  <td>
                    <span className={`badge ${post.status === 'published' ? 'badge-success' : post.status === 'draft' ? 'badge-warning' : 'badge-gray'}`}>
                      {post.status === 'published' ? 'Xuất bản' : post.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td className="hide-mobile" style={{color:'#9ca3af'}}>{post.views?.toLocaleString() || 0}</td>
                  <td>
                    <div style={{display:'flex',justifyContent:'flex-end',gap:4}}>
                      <button className="btn-icon" onClick={() => setEditing(post)} title="Chỉnh sửa">✎</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(post._id)} title="Xóa">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination">
          {[...Array(pages)].map((_, i) => (
            <button key={i} className={`page-btn${page === i+1 ? ' active' : ''}`} onClick={() => setPage(i+1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
