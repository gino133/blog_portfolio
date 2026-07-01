'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Capabilities' },
  { href: '/documents', label: 'Documentation' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">
        <span className="nav-brand-icon"><span></span><span></span><span></span></span>
        ENGINEERING_PORTFOLIO_V1.0
      </Link>

      <div className="nav-links">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`nav-link${pathname.startsWith(l.href) ? ' active' : ''}`}>
            {l.label}
          </Link>
        ))}
        <Link href="/admin/login" className="nav-link nav-cta">Login</Link>
      </div>

      <button className="nav-hamburger" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>

      <div className={`nav-mobile${open ? ' open' : ''}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
            className={`nav-link${pathname.startsWith(l.href) ? ' active' : ''}`}>
            {l.label}
          </Link>
        ))}
        <Link href="/admin/login" onClick={() => setOpen(false)} className="nav-link">Login</Link>
      </div>
    </nav>
  );
}
