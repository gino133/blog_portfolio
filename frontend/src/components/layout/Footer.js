import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">ENGINEERING_PORTFOLIO_V1.0</div>
          <p className="footer-desc">
            Precision engineering solutions for complex mechanical challenges.
            Quality-driven. Structurally sound. Built for industrial reliability.
          </p>
        </div>
        <div>
          <div className="footer-col-title">Resources</div>
          <Link href="/documents" className="footer-link">Specifications</Link>
          <Link href="/documents" className="footer-link">Documentation</Link>
          <Link href="/products" className="footer-link">Products</Link>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/blog" className="footer-link">Capabilities</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
        </div>
        <div>
          <div className="footer-col-title">Network</div>
          <a href="#" className="footer-link">LinkedIn</a>
          <a href="#" className="footer-link">GitHub</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© {new Date().getFullYear()} SYSTEM_CORE_OPERATIONS</span>
        <span className="footer-ver">SYS_VER_1.0.0 [STABLE]</span>
      </div>
    </footer>
  );
}
