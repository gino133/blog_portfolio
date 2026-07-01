import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { productsAPI } from '@/lib/api';

async function getProducts() {
  try {
    const res = await productsAPI.getAll({ limit: 24 });
    return res.data.products || [];
  } catch { return []; }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="section" style={{paddingBottom:0}}>
          <div style={{borderLeft:'4px solid var(--accent)',paddingLeft:20,marginBottom:40}}>
            <h1 style={{fontSize:'clamp(28px,4vw,44px)',marginBottom:12}}>SYSTEMS_INDEX</h1>
            <p style={{color:'var(--text-secondary)',maxWidth:560}}>
              A comprehensive catalog of mechanical assemblies and digital control systems
              designed for high-precision manufacturing and industrial automation.
            </p>
          </div>
        </div>

        <div className="section" style={{paddingTop:0}}>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⊞</div>
              <div className="empty-text">Chưa có sản phẩm nào trong hệ thống</div>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => (
                <div className="product-card" key={p._id}>
                  <div className="product-card-img">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1581092918484-8313ad669b69?w=600&q=80'} alt={p.name} />
                    <span className="product-ref">[{p.sku || 'REF-' + p._id.slice(-4).toUpperCase()}]</span>
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-title">{p.name}</div>
                    <div className="product-tags">
                      {(p.tags || []).slice(0,2).map((t,i) => (
                        <span key={i} className="product-tag">{t}</span>
                      ))}
                      {p.category && <span className="product-tag">{p.category}</span>}
                    </div>
                    <p className="product-desc">{p.shortDesc || p.description}</p>
                  </div>
                  <div className="product-card-actions">
                    <Link href={`/products/${p.slug}`} className="btn">Technical_Specs ▾</Link>
                  </div>
                  <Link href={`/products/${p.slug}`} className="btn btn-primary" style={{margin:'0 16px 16px',justifyContent:'center'}}>
                    View_Documentation ↗
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section" style={{paddingTop:0}}>
          <div className="info-box" style={{borderColor:'#f59e0b',background:'#fffbeb'}}>
            <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
              <span style={{fontSize:16}}>⚠</span>
              <div>
                <div className="info-box-label" style={{color:'#92400e'}}>System_Disclaimer</div>
                <p style={{fontSize:12,color:'#92400e'}}>
                  All schematics and firmware binaries are provided under the MIT_License.
                  Ensure voltage compliance prior to hardware integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
