'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▤' },
  { href: '/admin/posts', label: 'Bài viết', icon: '✎' },
  { href: '/admin/products', label: 'Sản phẩm', icon: '⊞' },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:40,height:40,border:'3px solid #e5e7eb',borderTopColor:'#6366f1',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 12px'}} />
          <p style={{color:'#9ca3af',fontSize:13}}>Đang tải...</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return children;

  return (
    <div className="admin-layout">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="overlay show" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>
          <span className="logo-text">Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Menu chính</div>
            {navItems.map(({ href, label, icon }) => (
              <Link key={href} href={href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item${pathname.startsWith(href) ? ' active' : ''}`}>
                <span style={{fontSize:16}}>{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-card">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <div style={{minWidth:0}}>
                <div className="user-name truncate">{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
            </div>
          )}
          <Link href="/" target="_blank" className="nav-item" style={{marginBottom:2}}>
            <span style={{fontSize:16}}>↗</span> Xem website
          </Link>
          <button onClick={logout} className="nav-item"
            style={{width:'100%',background:'none',border:'none',cursor:'pointer',color:'#ef4444',textAlign:'left'}}>
            <span style={{fontSize:16}}>⎋</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <span className="topbar-title">
            {navItems.find(n => pathname.startsWith(n.href))?.label || 'Admin'}
          </span>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
