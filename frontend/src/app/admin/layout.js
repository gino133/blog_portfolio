'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { section: 'OVERVIEW', items: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '▤' },
  ]},
  { section: 'CONTENT', items: [
    { href: '/admin/posts', label: 'Bài viết', icon: '✎' },
    { href: '/admin/products', label: 'Sản phẩm', icon: '⊞' },
    { href: '/admin/documents', label: 'Tài liệu', icon: '▣' },
  ]},
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
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#1a1a18'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:36,height:36,border:'2px solid #333',borderTopColor:'#4a9b6a',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 12px'}}/>
          <div style={{fontFamily:'Space Mono,monospace',fontSize:11,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em'}}>
            Authenticating...
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return children;

  const activeLabel = navItems.flatMap(g => g.items).find(n => pathname.startsWith(n.href))?.label || 'Admin';

  return (
    <div className="admin-wrap">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:49}} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-logo">
          <div className="admin-logo-brand">
            <div className="admin-logo-dot"/>
            ENG_PORT_V1.0
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(group => (
            <div key={group.section}>
              <div className="admin-nav-section">{group.section}</div>
              {group.items.map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`admin-nav-item${pathname.startsWith(item.href) ? ' active' : ''}`}>
                  <span style={{fontSize:14}}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-footer-nav">
          <Link href="/" target="_blank" className="admin-nav-item">
            <span>↗</span> View Site
          </Link>
          <button onClick={logout} className="admin-nav-item" style={{color:'#ef4444'}}>
            <span>⎋</span> Logout
          </button>
        </div>

        {user && (
          <div className="admin-user">
            <div className="admin-user-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="admin-user-name">{user.name}</div>
              <div className="admin-user-role">{user.role}</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button style={{background:'none',border:'none',cursor:'pointer',display:'flex',padding:4}}
            onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="18" height="18" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <span className="admin-topbar-title">{activeLabel}</span>
          <div style={{marginLeft:'auto',fontFamily:'var(--font-mono)',fontSize:10,color:'var(--green-bright)'}}>
            ● SYS_OPERATIONAL
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
