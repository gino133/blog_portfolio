import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { productsAPI } from '@/lib/api';
import { notFound } from 'next/navigation';

async function getProduct(slug) {
  try {
    const res = await productsAPI.getBySlug(slug);
    return res.data.product;
  } catch { return null; }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="container" style={{paddingTop:24,paddingBottom:64}}>
          <div className="breadcrumb">
            <Link href="/products">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
            <span className="ref-tag" style={{marginLeft:8}}>REF-{product._id.slice(-4).toUpperCase()}</span>
          </div>

          <Link href="/products" className="btn btn-ghost btn-sm" style={{marginBottom:24,display:'inline-flex'}}>
            ← Quay lại danh sách sản phẩm
          </Link>

          <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:40}} className="product-detail-grid">
            {/* Left: images + content */}
            <div>
              <div style={{position:'relative',background:'#1a1a18',aspectRatio:'4/3',overflow:'hidden',marginBottom:12}}>
                <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1581092918484-8313ad669b69?w=900&q=80'}
                  alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                <span className="badge badge-dark" style={{position:'absolute',top:12,left:12}}>Primary View</span>
              </div>

              {product.images?.length > 1 && (
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:32}}>
                  {product.images.slice(0,4).map((img,i) => (
                    <div key={i} style={{aspectRatio:'1',background:'#1a1a18',overflow:'hidden'}}>
                      <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    </div>
                  ))}
                </div>
              )}

              <div style={{marginBottom:32}}>
                <span className="ref-tag" style={{marginBottom:12,display:'inline-block'}}>[REF: AX-{product._id.slice(-3).toUpperCase()}]</span>
                <h1 style={{fontSize:'clamp(28px,4vw,40px)',marginBottom:16}}>{product.name.toUpperCase()}</h1>
                <p style={{color:'var(--text-secondary)',lineHeight:1.7,maxWidth:560}}>{product.description}</p>
              </div>

              {/* Spec table */}
              <div className="section-label">Thông số kỹ thuật</div>
              <div className="spec-grid" style={{marginBottom:40}}>
                <div className="spec-col">
                  <div className="spec-col-label">Thông số vật lý</div>
                  <div className="spec-row"><span className="spec-key">Trọng lượng</span><span className="spec-val">{product.weight || '—'} kg</span></div>
                  <div className="spec-row"><span className="spec-key">Kích thước</span><span className="spec-val">{product.dimensions || '—'}</span></div>
                  <div className="spec-row"><span className="spec-key">Vật liệu vỏ</span><span className="spec-val">{product.material || '—'}</span></div>
                </div>
                <div className="spec-col">
                  <div className="spec-col-label">Công suất</div>
                  <div className="spec-row"><span className="spec-key">Tồn kho</span><span className="spec-val">{product.stock ?? 0}</span></div>
                  <div className="spec-row"><span className="spec-key">Đơn hàng</span><span className="spec-val">{product.orders ?? 0}</span></div>
                  <div className="spec-row"><span className="spec-key">Đánh giá</span><span className="spec-val">{product.rating ?? 0}/5</span></div>
                </div>
                <div className="spec-col">
                  <div className="spec-col-label">Phân loại</div>
                  <div className="spec-row"><span className="spec-key">Danh mục</span><span className="spec-val">{product.category}</span></div>
                  <div className="spec-row"><span className="spec-key">SKU</span><span className="spec-val">{product.sku || '—'}</span></div>
                  <div className="spec-row"><span className="spec-key">Trạng thái</span><span className="spec-val">{product.status}</span></div>
                </div>
              </div>

              {product.tags?.length > 0 && (
                <div className="product-tags" style={{marginBottom:40}}>
                  {product.tags.map((t,i) => <span key={i} className="product-tag">{t}</span>)}
                </div>
              )}
            </div>

            {/* Right: sidebar */}
            <div>
              <div style={{position:'sticky',top:80}}>
                <div className="admin-card" style={{marginBottom:16}}>
                  <div className="info-box-label">Giá bán</div>
                  {product.salePrice ? (
                    <>
                      <div style={{fontSize:13,color:'var(--text-muted)',textDecoration:'line-through'}}>{product.price?.toLocaleString('vi-VN')}đ</div>
                      <div className="info-box-val" style={{color:'var(--accent)'}}>{product.salePrice?.toLocaleString('vi-VN')}đ</div>
                    </>
                  ) : (
                    <div className="info-box-val">{product.price?.toLocaleString('vi-VN')}đ</div>
                  )}
                </div>

                <Link href="/contact" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginBottom:10}}>
                  Yêu cầu báo giá kỹ thuật
                </Link>
                <button className="btn btn-outline" style={{width:'100%',justifyContent:'center',marginBottom:24}}>
                  Add to Design Library
                </button>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:24}}>
                  <div className="info-box">
                    <div className="info-box-label">ISO 9001:2015</div>
                    <div style={{fontSize:11,color:'var(--text-secondary)'}}>Certified Component</div>
                  </div>
                  <div className="info-box">
                    <div className="info-box-label">Global Delivery</div>
                    <div style={{fontSize:11,color:'var(--text-secondary)'}}>Express Logistics</div>
                  </div>
                </div>

                <div className="section-label">Related Documentation</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <a href="#" className="admin-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',textDecoration:'none',color:'inherit'}}>
                    <span style={{fontSize:12}}>📄 Bản vẽ kỹ thuật (PDF)</span>
                    <span>↓</span>
                  </a>
                  <a href="#" className="admin-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',textDecoration:'none',color:'inherit'}}>
                    <span style={{fontSize:12}}>📘 Hướng dẫn vận hành (PDF)</span>
                    <span>↓</span>
                  </a>
                  <a href="#" className="admin-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',textDecoration:'none',color:'inherit'}}>
                    <span style={{fontSize:12}}>◈ Mô hình 3D (STEP)</span>
                    <span>↓</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`@media (max-width: 900px) { .product-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
