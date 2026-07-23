import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && email.trim()) { setStep(2); return; }
    if (step === 2) router.push('/');
  };

  const handleGoogle = () => router.push('/');

  return (
    <>
      <Head><title>Sign in – YouTube</title></Head>
      <div className="auth-page">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <svg viewBox="0 0 28 20" width="32" height="23" fill="none">
              <path d="M27.97 3.12C27.64 1.89 26.68.93 25.45.6 23.22 0 14.28 0 14.28 0S5.35 0 3.12.6C1.89.93.93 1.89.6 3.12 0 5.35 0 10 0 10s0 4.65.6 6.88c.33 1.23 1.29 2.18 2.52 2.52C5.35 20 14.28 20 14.28 20s8.94 0 11.17-.6c1.23-.34 2.18-1.29 2.52-2.52C28.57 14.65 28.57 10 28.57 10s-.02-4.65-.6-6.88Z" fill="#FF0000"/>
              <path d="M11.43 14.29 18.85 10l-7.42-4.29v8.58Z" fill="white"/>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--yt-text)' }}>YouTube</span>
          </div>

          <h1 className="auth-title">Sign in</h1>
          <p className="auth-sub">
            {step === 1 ? 'Use your Google Account' : `Welcome back, ${email}`}
          </p>

          {/* Google sign-in button */}
          <button className="auth-google-btn" onClick={handleGoogle}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">or</div>

          <form onSubmit={handleNext}>
            {step === 1 ? (
              <input
                className="auth-input"
                type="email"
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            ) : (
              <input
                className="auth-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            )}
            <button className="auth-btn" type="submit">
              {step === 1 ? 'Next' : 'Sign in'}
            </button>
          </form>

          <div className="auth-footer">
            {step === 1 && (
              <>
                <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>
                  Forgot email?
                </a>
                <span style={{ margin: '0 8px', color: 'var(--yt-border)' }}>•</span>
              </>
            )}
            <Link href="/signup" className="auth-link">Create account</Link>
          </div>
        </div>
      </div>
    </>
  );
}
