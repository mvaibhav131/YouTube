import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    login({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      avatar: form.firstName[0]?.toUpperCase() || 'U',
    });
    setLoading(false);
    router.push('/');
  };

  return (
    <>
      <Head><title>Create account – YouTube</title></Head>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <svg viewBox="0 0 28 20" width="32" height="23" fill="none">
              <path d="M27.97 3.12C27.64 1.89 26.68.93 25.45.6 23.22 0 14.28 0 14.28 0S5.35 0 3.12.6C1.89.93.93 1.89.6 3.12 0 5.35 0 10 0 10s0 4.65.6 6.88c.33 1.23 1.29 2.18 2.52 2.52C5.35 20 14.28 20 14.28 20s8.94 0 11.17-.6c1.23-.34 2.18-1.29 2.52-2.52C28.57 14.65 28.57 10 28.57 10s-.02-4.65-.6-6.88Z" fill="#FF0000"/>
              <path d="M11.43 14.29 18.85 10l-7.42-4.29v8.58Z" fill="white"/>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--yt-text)' }}>YouTube</span>
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">to continue to YouTube</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 12 }}>
              <input className="auth-input" placeholder="First name" value={form.firstName} onChange={set('firstName')} required style={{ flex: 1 }} />
              <input className="auth-input" placeholder="Last name" value={form.lastName} onChange={set('lastName')} required style={{ flex: 1 }} />
            </div>
            <input className="auth-input" type="email" placeholder="Email address" value={form.email} onChange={set('email')} required />
            <input className="auth-input" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={set('password')} minLength={8} required />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <div className="auth-footer">
            Already have an account?{' '}
            <Link href="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps() { return { props: {} }; }
