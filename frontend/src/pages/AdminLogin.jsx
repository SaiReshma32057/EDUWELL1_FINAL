import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import API_BASE_URL from '../api/config';

function getApiErrorMessage(payload, fallback) {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }
  if (payload.message && String(payload.message).trim()) {
    return payload.message;
  }
  if (payload.data && typeof payload.data === 'object') {
    const firstValidationError = Object.values(payload.data).find((value) => typeof value === 'string' && value.trim());
    if (firstValidationError) {
      return firstValidationError;
    }
  }
  return fallback;
}

function createCaptcha() {
  const words = ['river', 'orchid', 'sunset', 'breeze', 'planet', 'garden', 'bridge', 'cloud', 'mountain', 'harbor', 'lighthouse', 'meadow'];
  const w = words[Math.floor(Math.random() * words.length)];
  // scramble letters
  const shuffled = w.split('').sort(() => Math.random() - 0.5).join('');
  return { challenge: shuffled, answer: w };
}

export default function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [captchaSeed, setCaptchaSeed] = useState(0);

  const captcha = useMemo(() => createCaptcha(), [captchaSeed]);

  const resetCaptcha = () => {
    setCaptchaSeed((prev) => prev + 1);
    setCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (submitting) {
      return;
    }

      if (!captchaInput || String(captchaInput).trim().toLowerCase() !== String(captcha.answer).toLowerCase()) {
        setError('Captcha verification failed. Try again.');
        resetCaptcha();
        return;
      }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('Email and password are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });

      const response = await res.json().catch(() => ({}));
      if (!res.ok || response.status !== 'success' || !response.data) {
        setError(getApiErrorMessage(response, `Invalid admin credentials (HTTP ${res.status}).`));
        resetCaptcha();
        return;
      }

      const role = String(response.data.role || 'STUDENT').toUpperCase();
      if (role !== 'ADMIN') {
        setError('This portal is only for admin accounts.');
        resetCaptcha();
        return;
      }

      const user = {
        id: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        role,
      };

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      localStorage.setItem('userId', String(response.data.userId));
      onLogin(user);
      navigate('/admin-dashboard', { replace: true });
    } catch (err) {
      if (err instanceof TypeError) {
        setError(`Backend is not reachable at ${API_BASE_URL}. Start the Spring Boot app and try again.`);
      } else {
        setError('Something went wrong. Please try again.');
      }
      resetCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-orange-100">
            <ShieldCheck size={38} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-serif font-medium text-stone-900">Admin Access</h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-bold mt-2">Secure Curator Login</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest rounded-2xl text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-700"
                placeholder="admin@eduwell.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-700"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Captcha</label>
              <div className="flex items-center gap-3">
                <div className="px-4 py-3 rounded-2xl bg-stone-100 text-stone-700 font-bold tracking-wider min-w-28 text-center">
                  {captcha.challenge}
                </div>
                <button
                  type="button"
                  onClick={resetCaptcha}
                  className="p-3 rounded-2xl border border-stone-200 text-stone-500 hover:text-orange-600 hover:border-orange-200 transition-colors"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-700"
                placeholder="Type the original word"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all"
            >
              {submitting ? 'Signing In...' : 'Login To Admin Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              Don't have an account?{' '}
              <Link to="/admin-signup" className="font-semibold text-orange-600 hover:text-orange-700">
                Create new
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
