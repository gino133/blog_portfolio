import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { postsAPI } from '@/lib/api';
import { format } from 'date-fns';

async function getPosts() {
  try {
    const res = await postsAPI.getAll({ limit: 20 });
    return res.data.posts || [];
  } catch { return []; }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="container" style={{paddingTop:48,paddingBottom:64}}>
          <div style={{borderLeft:'4px solid var(--accent)',paddingLeft:20,marginBottom:48}}>
            <div className="sys-label" style={{marginBottom:8}}>[ REF: CAPABILITIES_LOG ]</div>
            <h1 style={{fontSize:'clamp(28px,4vw,44px)',marginBottom:12}}>CAPABILITIES</h1>
            <p style={{color:'var(--text-secondary)',maxWidth:520}}>
              Technical insights, engineering methodologies, and case studies
              from precision mechanical design operations.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✎</div>
              <div className="empty-text">Chưa có bài viết nào</div>
              <Link href="/admin/posts" className="btn btn-primary btn-sm">Tạo bài viết đầu tiên</Link>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:1,border:'1px solid var(--border)'}}>
              {posts.map(post => (
                <Link href={`/blog/${post.slug}`} key={post._id}
                  style={{textDecoration:'none',color:'inherit'}}
                  className="blog-list-item">
                  <div style={{display:'grid',gridTemplateColumns:'140px 1fr',background:'white',transition:'background 0.15s'}}>
                    <div style={{background:'#1a1a18',overflow:'hidden',minHeight:120}}>
                      {post.coverImage
                        ? <img src={post.coverImage} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.8}} />
                        : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.1)',fontSize:32}}>▣</div>
                      }
                    </div>
                    <div style={{padding:'20px 24px',borderBottom:'1px solid var(--border)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                        {post.category && <span className="ref-tag">{post.category}</span>}
                        <span className="sys-label">
                          {post.publishedAt ? format(new Date(post.publishedAt), 'MMM yyyy') : ''}
                        </span>
                        {post.views > 0 && (
                          <span className="sys-label">👁 {post.views.toLocaleString()}</span>
                        )}
                      </div>
                      <h2 style={{fontSize:18,fontWeight:700,marginBottom:8,lineHeight:1.3}}>{post.title}</h2>
                      {post.excerpt && (
                        <p style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`.blog-list-item > div:hover { background: var(--accent-light) !important; }`}</style>
    </>
  );
}
