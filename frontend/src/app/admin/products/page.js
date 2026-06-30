'use client';
import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import ProductForm from './ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsAPI.adminGetAll({ page, limit: 15 });
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch { toast.error('Lỗi tải danh sách sản phẩm'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try { await productsAPI.delete(id); toast.success('Đã xóa'); fetchProducts(); }
    catch { toast.error('Lỗi khi xóa'); }
  };

  if (editing !== null) {
    return <ProductForm product={editing === 'new' ? null : editing}
      onSave={() => { setEditing(null); fetchProducts(); }} onCancel={() => setEditing(null)} />;
  }

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">{total} sản phẩm trong hệ thống</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary">+ Thêm sản phẩm</button>
      </div>

      <div style={{marginBottom:16}}>
        <div className="input-group" style={{maxWidth:280}}>
          <span className="icon">🔍</span>
          <input className="input input-search" placeholder="Tìm sản phẩm..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div style={{padding:'40px',textAlign:'center',color:'#9ca3af'}}>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:40,marginBottom:12}}>⊞</div>
            <p>Chưa có sản phẩm nào</p>
            <button onClick={() => setEditing('new')} className="btn btn-primary">Thêm sản phẩm đầu tiên</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th className="hide-mobile">Danh mục</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th style={{textAlign:'right'}}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product._id}>
                  <td>
                    <div style={{fontWeight:500,color:'#111827'}}>{product.name}</div>
                    {product.sku && <div style={{fontSize:11,color:'#9ca3af'}}>SKU: {product.sku}</div>}
                  </td>
                  <td className="hide-mobile" style={{color:'#6b7280'}}>{product.category}</td>
                  <td>
                    <span style={{fontWeight:600,color:'#111827'}}>{product.price?.toLocaleString('vi-VN')}đ</span>
                    {product.salePrice && (
                      <span style={{fontSize:11,color:'#10b981',marginLeft:6}}>→ {product.salePrice?.toLocaleString('vi-VN')}đ</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${product.status === 'active' ? 'badge-success' : product.status === 'inactive' ? 'badge-warning' : 'badge-danger'}`}>
                      {product.status === 'active' ? 'Hoạt động' : product.status === 'inactive' ? 'Tạm dừng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',justifyContent:'flex-end',gap:4}}>
                      <button className="btn-icon" onClick={() => setEditing(product)}>✎</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(product._id)}>🗑</button>
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
