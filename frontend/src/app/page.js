import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900 text-lg">My Blog</Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Portfolio</Link>
          <Link href="/admin/dashboard" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 transition-colors">
            Quản trị
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Blog &{' '}
          <span className="text-indigo-600">Portfolio</span>
        </h1>
        <p className="text-xl text-gray-500 mt-6 leading-relaxed">
          Chia sẻ kiến thức, kinh nghiệm và các dự án thú vị.
        </p>
        <div className="flex items-center gap-4 justify-center mt-10">
          <Link href="/blog" className="btn-primary px-8 py-3 text-base">
            Đọc blog
          </Link>
          <Link href="/products" className="btn-secondary px-8 py-3 text-base">
            Xem portfolio
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} My Blog & Portfolio</p>
      </footer>
    </div>
  );
}
