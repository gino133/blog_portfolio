'use client';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(res => setStats(res.data))
      .catch(() => toast.error('Không tải được thống kê'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <div><div className="admin-page-title">Dashboard</div><div className="admin-page-sub">SYSTEM_OVERVIEW_V1.0</div></div>
        </div>
        <div className="admin-stats-grid">
          {[...Array(4)].map((_,i) => (
            <div key={i} style={{height:100,background:'white',border:'1px solid var(--border)',animation:'pulse 1.5s infinite'}}/>
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    );
  }

  const maxBar = Math.max(...(stats?.monthlyData?.map(d => d.count) || [1]), 1);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <div className="admin-page-sub">SYSTEM_OVERVIEW // ACTIVE_SESSION</div>
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--green-bright)',display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:6,height:6,background:'var(--green-bright)',borderRadius:'50%',display:'block'}}/>
          SYS_STATUS: NOMINAL
        </div>
      </div>

      {/* Stat cards */}
      <div className="admin-stats-grid">
        {[
          { label:'TOTAL_POSTS', val: stats?.posts?.total ?? 0, sub:`${stats?.posts?.published ?? 0} published`, fill: 70 },
          { label:'TOTAL_VIEWS', val: (stats?.views?.total ?? 0).toLocaleString(), sub:'Cumulative', fill: 85 },
          { label:'PRODUCTS', val: stats?.products?.total ?? 0, sub:`${stats?.products?.active ?? 0} active`, fill: 60 },
          { label:'DOCUMENTS', val: stats?.documents?.total ?? 0, sub:'In registry', fill: 55 },
        ].map((s,i) => (
          <div key={i} className="admin-stat">
            <div className="admin-stat-label">{s.label}</div>
            <div className="admin-stat-val">{s.val}</div>
            <div className="admin-stat-sub">{s.sub}</div>
            <div className="admin-stat-bar"><div className="admin-stat-bar-fill" style={{width:`${s.fill}%`}}/></div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        {/* Top posts */}
        <div className="admin-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <div className="admin-form-section-title" style={{margin:0,borderBottom:'none',paddingBottom:0}}>TOP_POSTS // VIEWS</div>
            <Link href="/admin/posts" className="btn btn-ghost btn-sm">View_All →</Link>
          </div>
          {stats?.topPosts?.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {stats.topPosts.map((post,i) => (
                <div key={post._id} style={{display:'flex',alignItems:'center',gap:12}}>
                  <span className="mono" style={{fontSize:10,color:'var(--text-muted)',minWidth:16,textAlign:'right'}}>{String(i+1).padStart(2,'0')}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</div>
                    <div style={{height:2,background:'var(--border)',marginTop:4,borderRadius:1}}>
                      <div style={{height:'100%',background:'var(--accent)',width:`${(post.views/((stats.topPosts[0]?.views)||1))*100}%`}}/>
                    </div>
                  </div>
                  <span className="mono" style={{fontSize:10,color:'var(--text-muted)',whiteSpace:'nowrap'}}>{post.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{fontSize:12,color:'var(--text-muted)',fontFamily:'var(--font-mono)',textAlign:'center',padding:'20px 0'}}>
              NO_DATA_AVAILABLE
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="admin-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <div className="admin-form-section-title" style={{margin:0,borderBottom:'none',paddingBottom:0}}>RECENT_ACTIVITY</div>
          </div>
          {stats?.recentPosts?.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {stats.recentPosts.map(post => (
                <div key={post._id} style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className={`badge ${post.status === 'published' ? 'badge-green' : post.status === 'draft' ? 'badge-yellow' : 'badge-gray'}`}>
                    {post.status === 'published' ? 'LIVE' : post.status === 'draft' ? 'DRAFT' : 'ARCH'}
                  </span>
                  <span style={{flex:1,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{fontSize:12,color:'var(--text-muted)',fontFamily:'var(--font-mono)',textAlign:'center',padding:'20px 0'}}>
              NO_DATA_AVAILABLE
            </div>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div className="admin-card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <div className="admin-form-section-title" style={{margin:0,borderBottom:'none',paddingBottom:0}}>POSTS_PER_MONTH // LAST_6M</div>
          <span className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>CHART_TYPE: BAR</span>
        </div>
        {stats?.monthlyData?.length > 0 ? (
          <div style={{display:'flex',alignItems:'flex-end',gap:8,height:80,paddingTop:8}}>
            {stats.monthlyData.slice(-6).map((d,i) => (
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,height:'100%'}}>
                <div style={{width:'100%',background:'var(--accent)',borderRadius:'2px 2px 0 0',height:`${(d.count/maxBar)*100}%`,minHeight:4,transition:'height 0.3s'}}/>
                <span className="mono" style={{fontSize:9,color:'var(--text-muted)'}}>{d._id.month}/{String(d._id.year).slice(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{height:80,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>NO_DATA_AVAILABLE</span>
          </div>
        )}
      </div>
    </div>
  );
}
