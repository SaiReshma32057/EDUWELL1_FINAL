import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldPlus } from 'lucide-react';
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

export default function AdminSignup({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (submitting) {
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const normalizedAge = Number(age);

    if (!normalizedName || !normalizedEmail || !normalizedPassword || !Number.isFinite(normalizedAge) || normalizedAge < 1) {
      setError('Please enter valid name, email, password, and age.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password: normalizedPassword,
          age: normalizedAge,
          role: 'admin',
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.status !== 'success' || !payload.data) {
        setError(getApiErrorMessage(payload, `Could not create admin account (HTTP ${res.status}).`));
        return;
      }

      const role = String(payload.data.role || 'STUDENT').toUpperCase();
      if (role !== 'ADMIN') {
        setError('Created account is not an admin account.');
        return;
      }

      const user = {
        id: payload.data.userId,
        name: payload.data.name,
        email: payload.data.email,
        role,
      };

      if (payload.data.token) {
        localStorage.setItem('authToken', payload.data.token);
      }
      localStorage.setItem('userId', String(payload.data.userId));
      onLogin(user);
      navigate('/admin-dashboard', { replace: true });
    } catch (err) {
      if (err instanceof TypeError) {
        setError(`Backend is not reachable at ${API_BASE_URL}. Start the Spring Boot app and try again.`);
      } else {
        setError('Something went wrong. Please try again.');
      }
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
            <ShieldPlus size={38} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-serif font-medium text-stone-900">Create Admin Account</h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-bold mt-2">Register For Curator Access</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest rounded-2xl text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-700"
                placeholder="Admin Name"
                required
              />
            </div>

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
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Age</label>
              <input
                type="number"
                min="1"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-700"
                placeholder="30"
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
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-700"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all"
            >
              {submitting ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              Already have an account?{' '}
              <Link to="/admin-login" className="font-semibold text-orange-600 hover:text-orange-700">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
