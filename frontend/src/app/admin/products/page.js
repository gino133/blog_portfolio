'use client';
import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import ProductForm from './ProductForm';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsAPI.adminGetAll({ page, limit: 15 });
      setProducts(res.data.products); setTotal(res.data.total); setPages(res.data.pages);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try { await productsAPI.delete(id); toast.success('Đã xóa'); fetch(); }
    catch { toast.error('Lỗi khi xóa'); }
  };

  if (editing !== null) {
    return <ProductForm product={editing === 'new' ? null : editing}
      onSave={() => { setEditing(null); fetch(); }} onCancel={() => setEditing(null)} />;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sản phẩm</h1>
          <div className="admin-page-sub">SYSTEMS_INDEX // {total} UNITS</div>
        </div>
        <button onClick={() => setEditing('new')} className="btn btn-primary btn-sm">+ NEW_UNIT</button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div style={{padding:40,textAlign:'center',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>LOADING_DATA...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⊞</div>
            <div className="empty-text">No products found</div>
            <button onClick={() => setEditing('new')} className="btn btn-primary btn-sm">Add First Product</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Unit_ID / Name</th>
                <th className="hide-m">Category</th>
                <th>Price</th>
                <th className="hide-m">Stock</th>
                <th>Status</th>
                <th style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="td-primary">{p.name}</div>
                    {p.sku && <div className="td-mono" style={{marginTop:2}}>SKU:{p.sku}</div>}
                  </td>
                  <td className="hide-m td-muted">{p.category}</td>
                  <td>
                    <span style={{fontWeight:700,fontSize:13}}>{p.price?.toLocaleString('vi-VN')}đ</span>
                    {p.salePrice && <span style={{fontSize:11,color:'var(--green-bright)',marginLeft:6}}>→{p.salePrice?.toLocaleString('vi-VN')}đ</span>}
                  </td>
                  <td className="hide-m td-muted">{p.stock ?? 0}</td>
                  <td>
                    <span className={`badge ${p.status === 'active' ? 'badge-green' : p.status === 'inactive' ? 'badge-yellow' : 'badge-gray'}`}>
                      {p.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',justifyContent:'flex-end',gap:6}}>
                      <button className="btn-icon-action" onClick={() => setEditing(p)}>✎</button>
                      <button className="btn-icon-action danger" onClick={() => handleDelete(p._id)}>✕</button>
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
            <button key={i} className={`page-btn${page===i+1?' active':''}`} onClick={() => setPage(i+1)}>{i+1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
