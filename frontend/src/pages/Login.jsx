import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
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

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('Email and password are required.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });
      const response = await res.json().catch(() => ({}));

      if (res.ok) {
        if (response.status === 'success' && response.data) {
          const role = (response.data.role || 'STUDENT').toUpperCase();
          const user = {
            id: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            role
          };
          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
          }
          localStorage.setItem('userId', String(response.data.userId));
          onLogin(user);
          navigate(role === 'ADMIN' ? '/admin-dashboard' : '/student-dashboard');
        } else {
          setError(getApiErrorMessage(response, 'Invalid email or password'));
        }
      } else {
        setError(getApiErrorMessage(response, `Login failed (HTTP ${res.status}).`));
      }
    } catch (err) {
      if (err instanceof TypeError) {
        setError(`Backend is not reachable at ${API_BASE_URL}. Start the Spring Boot app and try again.`);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg relative overflow-hidden">
      {/* Decorative Elements - Beach Vibes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500 opacity-[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500 opacity-[0.08] rounded-full blur-3xl" />
        {/* Wave pattern */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-5">
          <svg viewBox="0 0 1440 320" className="w-full h-full"><path fill="#008080" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        </div>
      </div>

      <div className="login-doodle-layer" aria-hidden="true">
        <div className="login-doodle shell shell-a">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 12C21 12 12 21 12 32c0 11 9 20 20 20s20-9 20-20c0-11-9-20-20-20Z" fill="currentColor" fillOpacity="0.34"/>
            <path d="M32 14v37M24 18l8 33M40 18l-8 33" stroke="currentColor" strokeOpacity="0.66" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="login-doodle shell shell-b">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 35c0-12 9-21 21-21s21 9 21 21c0 8-6 16-13 16H24c-7 0-13-8-13-16Z" fill="currentColor" fillOpacity="0.3"/>
            <path d="M32 15v36M22 22l10 29M42 22 32 51" stroke="currentColor" strokeOpacity="0.62" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="login-doodle shell shell-c">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 34c0-11 9-20 20-20s20 9 20 20c0 8-6 16-14 16H26c-8 0-14-8-14-16Z" fill="currentColor" fillOpacity="0.3"/>
            <path d="M32 16v34M24 21l8 29M40 21l-8 29" stroke="currentColor" strokeOpacity="0.64" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="login-doodle jelly jelly-a">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 30c0-11 9-20 20-20s20 9 20 20H12Z" fill="currentColor" fillOpacity="0.32"/>
            <path d="M20 30v17M28 30v21M36 30v18M44 30v14" stroke="currentColor" strokeOpacity="0.62" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="login-doodle jelly jelly-b">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 31c0-10 8-18 18-18s18 8 18 18H14Z" fill="currentColor" fillOpacity="0.3"/>
            <path d="M22 31v15M30 31v18M38 31v15" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="login-doodle jelly jelly-c">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 30c0-10 8-19 19-19s19 9 19 19H13Z" fill="currentColor" fillOpacity="0.32"/>
            <path d="M22 30v16M30 30v19M38 30v16M46 30v12" stroke="currentColor" strokeOpacity="0.62" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-teal-100">
            <Heart size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-serif font-medium text-stone-900 mb-3 tracking-tight">Oceanic Wellness</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">Your Sanctuary for Wellness</p>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-stone-100 elegant-shadow">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest rounded-2xl text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium text-stone-700"
                  placeholder="name@university.edu"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium text-stone-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-stone-200 hover:opacity-90 transition-all"
            >
              Enter Sanctuary
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-stone-50 text-center">
            <p className="text-stone-400 text-xs font-medium italic">
              &quot;Wellness is the natural state of being.&quot;
            </p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Quick Access for Demo</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => { setEmail('student@eduwell.com'); setPassword('student123'); }}
              className="px-4 py-2 bg-white border border-stone-100 rounded-full text-[10px] font-bold text-stone-500 hover:border-brand-primary transition-colors"
            >
              Student
            </button>
            <button 
              onClick={() => { setEmail('admin@eduwell.com'); setPassword('admin123'); }}
              className="px-4 py-2 bg-white border border-stone-100 rounded-full text-[10px] font-bold text-stone-500 hover:border-brand-primary transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
