'use client';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';
import { FileText, Package, Eye, Users, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value?.toLocaleString('vi-VN') ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
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
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-28 bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  const growth = stats?.posts?.lastMonth > 0
    ? Math.round(((stats.posts.thisMonth - stats.posts.lastMonth) / stats.posts.lastMonth) * 100)
    : null;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng quan website của bạn</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText} label="Bài viết" color="bg-indigo-500"
          value={stats?.posts?.total}
          sub={`${stats?.posts?.published} đã xuất bản`}
        />
        <StatCard
          icon={Eye} label="Lượt xem" color="bg-emerald-500"
          value={stats?.views?.total}
          sub="Tổng cộng"
        />
        <StatCard
          icon={Package} label="Sản phẩm" color="bg-amber-500"
          value={stats?.products?.total}
          sub={`${stats?.products?.active} đang hoạt động`}
        />
        <StatCard
          icon={Users} label="Người dùng" color="bg-violet-500"
          value={stats?.users?.total}
          sub="Tài khoản"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top posts */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Bài viết phổ biến</h2>
          </div>
          <div className="space-y-3">
            {stats?.topPosts?.length > 0 ? stats.topPosts.map((post, i) => (
              <div key={post._id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                </div>
                <span className="text-xs text-gray-500 tabular-nums">{post.views.toLocaleString()} lượt</span>
              </div>
            )) : (
              <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Recent posts */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Hoạt động gần đây</h2>
          </div>
          <div className="space-y-3">
            {stats?.recentPosts?.length > 0 ? stats.recentPosts.map((post) => (
              <div key={post._id} className="flex items-center gap-3">
                <span className={`badge-${post.status}`}>
                  {post.status === 'published' ? 'Xuất bản' : post.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                </span>
                <p className="text-sm text-gray-900 truncate flex-1">{post.title}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {format(new Date(post.createdAt), 'dd/MM', { locale: vi })}
                </span>
              </div>
            )) : (
              <p className="text-sm text-gray-400">Chưa có bài viết</p>
            )}
          </div>
        </div>
      </div>

      {/* Month stats */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-1">Tháng này</h2>
        <p className="text-sm text-gray-500 mb-4">
          Đã tạo <span className="font-semibold text-indigo-600">{stats?.posts?.thisMonth ?? 0}</span> bài viết
          {growth !== null && (
            <span className={`ml-2 ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              ({growth >= 0 ? '+' : ''}{growth}% so với tháng trước)
            </span>
          )}
        </p>
        {/* Simple bar chart */}
        <div className="flex items-end gap-1.5 h-20">
          {stats?.monthlyData?.slice(-6).map((d, i) => {
            const max = Math.max(...stats.monthlyData.map(x => x.count), 1);
            const pct = (d.count / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-indigo-500 rounded-sm transition-all" style={{ height: `${pct}%`, minHeight: 4 }} />
                <span className="text-xs text-gray-400">{d._id.month}/{String(d._id.year).slice(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
