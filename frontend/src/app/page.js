import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { postsAPI, productsAPI } from '@/lib/api';

async function getData() {
  try {
    const [postsRes, productsRes] = await Promise.all([
      postsAPI.getAll({ limit: 3 }).catch(() => ({ data: { posts: [] } })),
      productsAPI.getAll({ limit: 3 }).catch(() => ({ data: { products: [] } })),
    ]);
    return { posts: postsRes.data.posts || [], products: productsRes.data.products || [] };
  } catch {
    return { posts: [], products: [] };
  }
}

export default async function HomePage() {
  const { products } = await getData();

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        {/* Hero */}
        <div className="hero">
          <div className="hero-grid">
            <div>
              <div className="hero-sys-status">System_Status: Operational</div>
              <h1 className="hero-title">STRUCTURAL<br/>INTEGRITY<br/>THROUGH<br/>PRECISION<br/>DESIGN.</h1>
              <p className="hero-desc">
                High-precision mechanical engineering focused on robust structural systems
                and documented technical execution. Building the hardware that drives future automation.
              </p>
              <div className="hero-actions">
                <Link href="/products" className="btn btn-primary">Initialize_Protocol →</Link>
                <Link href="/documents" className="btn btn-outline">View_Blueprints</Link>
              </div>
            </div>
            <div className="hero-img">
              <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" alt="Mechanical system" />
              <span className="hero-img-tag">UNIT_REF: 882-X-CHASSIS</span>
            </div>
          </div>
        </div>

        {/* System status bar */}
        <div className="sys-bar">
          <span className="sys-bar-item">SYS_HEALTH: <strong>NOMINAL</strong></span>
          <span className="sys-bar-item">UPTIME: <strong>99.98%</strong></span>
          <span className="sys-bar-item">ACTIVE_PROJECTS: <strong>12</strong></span>
          <span className="sys-bar-item">CERTIFICATIONS: <strong>ISO_9001</strong></span>
        </div>

        {/* Core competencies */}
        <div className="section">
          <div className="section-label">Core_Competencies / Technical_Stack_Inventory_V1.0</div>
          <div className="cards-grid cards-grid-4" style={{border:'1px solid var(--border)'}}>
            <div className="skill-card">
              <div className="skill-card-num">[01]</div>
              <div className="skill-card-icon">⚙</div>
              <div className="skill-card-title">CAD_Modeling</div>
              <div className="skill-card-desc">Advanced parametric design using industry-standard environments. Manufacturing-ready documentation.</div>
              <div className="skill-tags">
                <span className="skill-tag">SOLIDWORKS</span>
                <span className="skill-tag">FUSION360</span>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-card-num">[02]</div>
              <div className="skill-card-icon">▣</div>
              <div className="skill-card-title">FEA_Analysis</div>
              <div className="skill-card-desc">Stress, thermal, and fluid dynamics simulations across critical load paths.</div>
              <div className="skill-tags"><span className="skill-tag">ANSYS</span></div>
            </div>
            <div className="skill-card">
              <div className="skill-card-num">[03]</div>
              <div className="skill-card-icon">▲</div>
              <div className="skill-card-title">Prototyping</div>
              <div className="skill-card-desc">Rapid iteration via CNC and additive manufacturing pipelines.</div>
              <div className="skill-tags"><span className="skill-tag">CNC</span><span className="skill-tag">3D_PRINT</span></div>
            </div>
            <div className="skill-card">
              <div className="skill-card-num">[04]</div>
              <div className="skill-card-icon">⬡</div>
              <div className="skill-card-title">Material_Science</div>
              <div className="skill-card-desc">Specialized in aerospace alloys and composite material integration.</div>
              <div className="skill-tags"><span className="skill-tag">AL-6061</span><span className="skill-tag">TI-6AL4V</span></div>
            </div>
          </div>
        </div>

        {/* Recent operations / Products */}
        <div className="dark-section">
          <div className="container" style={{padding:0}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
              <h2 style={{color:'white',fontSize:24}}>RECENT_OPERATIONS</h2>
              <Link href="/products" className="btn btn-outline" style={{borderColor:'#444',color:'#ccc'}}>View_All →</Link>
            </div>
            <div className="products-grid">
              {products.length > 0 ? products.map(p => (
                <Link href={`/products/${p.slug}`} key={p._id} className="product-card" style={{textDecoration:'none'}}>
                  <div className="product-card-img">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1581092918484-8313ad669b69?w=600&q=80'} alt={p.name} />
                    <span className="product-ref">REF: {p.sku || p._id.slice(-4).toUpperCase()}</span>
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-title">{p.name}</div>
                    <div className="product-desc">{p.shortDesc || p.description}</div>
                  </div>
                </Link>
              )) : (
                [1,2,3].map(i => (
                  <div key={i} className="product-card">
                    <div className="product-card-img">
                      <img src={`https://images.unsplash.com/photo-158109291${i}-0c4c3acd3789?w=600&q=80`} alt="placeholder" />
                      <span className="product-ref">REF_X{i}</span>
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-title">Sample_Unit_{i}</div>
                      <div className="product-desc">Thêm sản phẩm trong trang quản trị để hiển thị tại đây.</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="section text-center" style={{borderTop:'1px solid var(--border)'}}>
          <h2 style={{fontSize:28,marginBottom:14}}>READY TO OPTIMIZE YOUR NEXT MECHANICAL VENTURE?</h2>
          <p style={{color:'var(--text-secondary)',marginBottom:28,maxWidth:480,marginLeft:'auto',marginRight:'auto'}}>
            Download the full technical specification document or request a direct communication link for partnership inquiries.
          </p>
          <div className="hero-actions" style={{justifyContent:'center'}}>
            <Link href="/contact" className="btn btn-primary">Connect_Via_Encrypted_Line</Link>
            <Link href="/documents" className="btn btn-outline">Download_Full_Vita</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
