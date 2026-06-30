'use client';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';
import toast from 'react-hot-toast';

function StatCard({ icon, label, value, sub, colorClass }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>
        <span style={{fontSize:20}}>{icon}</span>
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value?.toLocaleString('vi-VN') ?? '—'}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

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
        <div className="page-header">
          <div><div className="page-title">Dashboard</div><div className="page-subtitle">Tổng quan website</div></div>
        </div>
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{height:100,background:'#f3f4f6',borderRadius:14,animation:'pulse 1.5s infinite'}} />
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    );
  }

  const growth = stats?.posts?.lastMonth > 0
    ? Math.round(((stats.posts.thisMonth - stats.posts.lastMonth) / stats.posts.lastMonth) * 100)
    : null;

  const maxBar = Math.max(...(stats?.monthlyData?.map(d => d.count) || [1]), 1);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Tổng quan website của bạn</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="✎" label="Bài viết" colorClass="indigo"
          value={stats?.posts?.total} sub={`${stats?.posts?.published || 0} đã xuất bản`} />
        <StatCard icon="👁" label="Lượt xem" colorClass="green"
          value={stats?.views?.total} sub="Tổng cộng" />
        <StatCard icon="⊞" label="Sản phẩm" colorClass="amber"
          value={stats?.products?.total} sub={`${stats?.products?.active || 0} đang hoạt động`} />
        <StatCard icon="👤" label="Người dùng" colorClass="purple"
          value={stats?.users?.total} sub="Tài khoản" />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
        {/* Top posts */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔥 Bài viết phổ biến</div>
          </div>
          {stats?.topPosts?.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {stats.topPosts.map((post, i) => (
                <div key={post._id} style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:12,fontWeight:700,color:'#9ca3af',minWidth:18}}>{i + 1}</span>
                  <span style={{flex:1,fontSize:13,color:'#374151',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</span>
                  <span style={{fontSize:12,color:'#9ca3af',whiteSpace:'nowrap'}}>{post.views.toLocaleString()} lượt</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{fontSize:13,color:'#9ca3af'}}>Chưa có dữ liệu</p>
          )}
        </div>

        {/* Recent */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🕐 Hoạt động gần đây</div>
          </div>
          {stats?.recentPosts?.length > 0 ? (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {stats.recentPosts.map(post => (
                <div key={post._id} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span className={`badge ${post.status === 'published' ? 'badge-success' : post.status === 'draft' ? 'badge-warning' : 'badge-gray'}`}>
                    {post.status === 'published' ? 'Xuất bản' : post.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                  </span>
                  <span style={{flex:1,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{fontSize:13,color:'#9ca3af'}}>Chưa có bài viết</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📊 Bài viết theo tháng</div>
          {growth !== null && (
            <span className={`badge ${growth >= 0 ? 'badge-success' : 'badge-danger'}`}>
              {growth >= 0 ? '+' : ''}{growth}% tháng này
            </span>
          )}
        </div>
        {stats?.monthlyData?.length > 0 ? (
          <div className="bar-chart">
            {stats.monthlyData.slice(-6).map((d, i) => (
              <div key={i} className="bar-col">
                <div className="bar" style={{height: `${(d.count / maxBar) * 100}%`}} title={`${d.count} bài`} />
                <div className="bar-label">{d._id.month}/{String(d._id.year).slice(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{fontSize:13,color:'#9ca3af'}}>Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
