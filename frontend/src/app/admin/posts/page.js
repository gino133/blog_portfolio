'use client';
import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import PostForm from './PostForm';
import { format } from 'date-fns';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postsAPI.adminGetAll({ page, limit: 15, search, status });
      setPosts(res.data.posts); setTotal(res.data.total); setPages(res.data.pages);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa bài viết này?')) return;
    try { await postsAPI.delete(id); toast.success('Đã xóa'); fetch(); }
    catch { toast.error('Lỗi khi xóa'); }
  };

  if (editing !== null) {
    return <PostForm post={editing === 'new' ? null : editing}
      onSave={() => { setEditing(null); fetch(); }} onCancel={() => setEditing(null)} />;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bài viết</h1>
          <div className="admin-page-sub">CONTENT_MATRIX // {total} ENTRIES</div>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary btn-sm">+ NEW_POST</button>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <input className="input-box" style={{flex:1,minWidth:200}} placeholder="SEARCH_POSTS..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="input-box" style={{width:'auto'}} value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">ALL_STATUS</option>
          <option value="published">PUBLISHED</option>
          <option value="draft">DRAFT</option>
          <option value="archived">ARCHIVED</option>
        </select>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div style={{padding:40,textAlign:'center',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>
            LOADING_DATA...
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✎</div>
            <div className="empty-text">No posts found</div>
            <button onClick={() => setEditing('new')} className="btn btn-primary btn-sm">Create First Post</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Document_ID / Title</th>
                <th className="hide-m">Category</th>
                <th>Status</th>
                <th className="hide-m">Views</th>
                <th className="hide-m">Date</th>
                <th style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td>
                    <div className="td-primary">{post.title}</div>
                    <div className="td-mono" style={{marginTop:2}}>ID:{post._id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td className="hide-m td-muted">{post.category || '—'}</td>
                  <td>
                    <span className={`badge ${post.status === 'published' ? 'badge-green' : post.status === 'draft' ? 'badge-yellow' : 'badge-gray'}`}>
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="hide-m td-muted">{post.views?.toLocaleString() || 0}</td>
                  <td className="hide-m td-muted">
                    {format(new Date(post.createdAt), 'dd/MM/yy')}
                  </td>
                  <td>
                    <div style={{display:'flex',justifyContent:'flex-end',gap:6}}>
                      <button className="btn-icon-action" onClick={() => setEditing(post)} title="Edit">✎</button>
                      <button className="btn-icon-action danger" onClick={() => handleDelete(post._id)} title="Delete">✕</button>
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
          {[...Array(pages)].map((_,i) => (
            <button key={i} className={`page-btn${page === i+1 ? ' active' : ''}`} onClick={() => setPage(i+1)}>
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
