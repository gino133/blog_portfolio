'use client';
import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '@/lib/api';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
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
    } catch {
      toast.error('Lỗi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Đã xóa');
      fetchProducts();
    } catch {
      toast.error('Lỗi khi xóa');
    }
  };

  if (editing !== null) {
    return (
      <ProductForm
        product={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); fetchProducts(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sản phẩm</h1>
          <p className="text-sm text-gray-500">{total} sản phẩm</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Tìm sản phẩm..." value={search}
          onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Đang tải...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">Chưa có sản phẩm nào</p>
            <button onClick={() => setEditing('new')} className="btn-primary mt-3 text-sm">
              Thêm sản phẩm đầu tiên
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tên sản phẩm</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Giá</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{product.name}</p>
                    {product.sku && <p className="text-xs text-gray-400">SKU: {product.sku}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{product.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-green-600 ml-1">
                        → {product.salePrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.status === 'active' ? 'badge-published' :
                      product.status === 'inactive' ? 'badge-draft' : 'badge-archived'}>
                      {product.status === 'active' ? 'Hoạt động' : product.status === 'inactive' ? 'Tạm dừng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(product)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(product._id)}
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

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${
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
