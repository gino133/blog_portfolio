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
      toast.success(`ACCESS_GRANTED // Welcome, ${user.name}`);
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'ACCESS_DENIED // Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-bg-grid" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon"><span /><span /><span /></div>
          ENGINEERING_PORTFOLIO_V1.0
        </div>
        <h1 className="login-title">ADMIN_ACCESS</h1>
        <p className="login-sub">[ SYS_AUTH_MODULE // SECURE_INTERFACE ]</p>

        <form onSubmit={handleSubmit}>
          <label className="login-label">01. Network_Address / Email</label>
          <input className="login-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@node.sys" required />

          <label className="login-label">02. Auth_Token / Password</label>
          <input className="login-input" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••" required />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'INITIALIZE_SESSION →'}
          </button>
        </form>

        <div className="login-footer">
          Restricted access. ·{' '}
          <a href="/">Return to Portfolio</a>
        </div>
      </div>
    </div>
  );
}
