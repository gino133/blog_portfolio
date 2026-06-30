'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Chào mừng, ${user.name}!`);
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">A</div>
        <h1 className="login-title">Đăng nhập quản trị</h1>
        <p className="login-sub">Truy cập bảng điều khiển website của bạn</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="input" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="input" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg"
            style={{width:'100%', justifyContent:'center', marginTop:8}}
            disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-muted mt-4">
          Chỉ dành cho quản trị viên ·{' '}
          <a href="/" style={{color:'var(--primary)'}}>Về trang chủ</a>
        </p>
      </div>
    </div>
  );
}
