import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { postsAPI } from '@/lib/api';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

async function getPost(slug) {
  try {
    const res = await postsAPI.getBySlug(slug);
    return res.data.post;
  } catch { return null; }
}

export default async function BlogDetailPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) return notFound();

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        {post.coverImage && (
          <div style={{height:'40vh',maxHeight:400,background:'#1a1a18',overflow:'hidden'}}>
            <img src={post.coverImage} alt={post.title}
              style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.7}} />
          </div>
        )}
        <div className="container" style={{paddingTop:40,paddingBottom:80,maxWidth:760}}>
          <div className="breadcrumb" style={{marginBottom:24}}>
            <Link href="/blog">Capabilities</Link>
            <span>/</span>
            <span>{post.title}</span>
          </div>

          {post.category && <span className="ref-tag" style={{marginBottom:16,display:'inline-block'}}>{post.category}</span>}
          <h1 style={{fontSize:'clamp(26px,4vw,40px)',marginBottom:16,lineHeight:1.1}}>{post.title}</h1>

          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:32,paddingBottom:24,borderBottom:'1px solid var(--border)'}}>
            <span className="sys-label">
              {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : ''}
            </span>
            {post.author?.name && (
              <span className="sys-label">// {post.author.name}</span>
            )}
            {post.views > 0 && <span className="sys-label">👁 {post.views.toLocaleString()}</span>}
          </div>

          {post.excerpt && (
            <p style={{fontSize:16,color:'var(--text-secondary)',lineHeight:1.8,marginBottom:32,fontStyle:'italic',borderLeft:'3px solid var(--accent)',paddingLeft:16}}>
              {post.excerpt}
            </p>
          )}

          <div className="post-content" style={{fontSize:15,lineHeight:1.85,color:'var(--text-secondary)'}}>
            {(post.content || '').split('\n').map((para, i) =>
              para.trim() ? <p key={i} style={{marginBottom:16}}>{para}</p> : <br key={i} />
            )}
          </div>

          {post.tags?.length > 0 && (
            <div style={{marginTop:40,paddingTop:24,borderTop:'1px solid var(--border)'}}>
              <div className="product-tags">
                {post.tags.map((t,i) => <span key={i} className="product-tag">{t}</span>)}
              </div>
            </div>
          )}

          <div style={{marginTop:40}}>
            <Link href="/blog" className="btn btn-outline">← Back to Capabilities</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
