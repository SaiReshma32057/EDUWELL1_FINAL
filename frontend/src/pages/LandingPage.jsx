import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, Shield, Sparkles, X, ChevronRight, User, Calendar, Mail, Lock, AtSign } from 'lucide-react';
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

export default function LandingPage({ onLogin }) {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1); // 1: Role, 2: Details
  const [signUpError, setSignUpError] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    username: '',
    email: '',
    password: '',
    age: '', 
    role: '' 
  });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignUpError('');

    const normalizedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedPassword = formData.password.trim();
    const normalizedAge = Number(formData.age);

    if (!normalizedName || !normalizedEmail || !normalizedPassword || !Number.isFinite(normalizedAge) || normalizedAge < 1) {
      setSignUpError('Please enter valid name, email, password, and age.');
      return;
    }

    try {
      setSigningUp(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password: normalizedPassword,
          age: normalizedAge,
          role: formData.role,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.status !== 'success' || !result.data) {
        setSignUpError(getApiErrorMessage(result, `Could not complete signup (HTTP ${response.status}).`));
        return;
      }

      const role = String(result.data.role || 'STUDENT').toUpperCase();
      const user = {
        id: result.data.userId,
        name: result.data.name,
        email: result.data.email,
        role,
      };

      if (result.data.token) {
        localStorage.setItem('authToken', result.data.token);
      }
      localStorage.setItem('userId', String(result.data.userId));
      onLogin(user);

      setShowSignUp(false);
      setSignUpStep(1);
      setFormData({ name: '', username: '', email: '', password: '', age: '', role: '' });
      navigate(role === 'ADMIN' ? '/admin-dashboard' : '/student-dashboard', { replace: true });
    } catch (err) {
      if (err instanceof TypeError) {
        setSignUpError(`Backend is not reachable at ${API_BASE_URL}. Start the Spring Boot app and try again.`);
      } else {
        setSignUpError('Something went wrong while creating your account.');
      }
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg relative">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-linear-to-b from-[#87CEEB] to-brand-primary overflow-hidden">
        {/* Background Pattern - Waves */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z" fill="white" opacity="0.1" />
            <path d="M0 60 Q 25 50 50 60 T 100 60 V 100 H 0 Z" fill="white" opacity="0.1" />
          </svg>
        </div>
        
        {/* Decorative Glows - Sun */}
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-yellow-200/20 rounded-full blur-[100px]" />

        <div className="landing-doodle-layer" aria-hidden="true">
          <div className="landing-doodle shell shell-a">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 10C21 10 12 19 12 30c0 13 9 24 20 24s20-11 20-24c0-11-9-20-20-20Z" fill="currentColor" fillOpacity="0.36"/>
              <path d="M32 13v38M24 16l8 35M40 16l-8 35M18 23l14 28M46 23 32 51" stroke="currentColor" strokeOpacity="0.68" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="landing-doodle shell shell-b">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 38c0-14 11-25 25-25s25 11 25 25c0 9-5 16-13 16H23c-8 0-13-7-13-16Z" fill="currentColor" fillOpacity="0.32"/>
              <path d="M32 14v39M24 17l8 36M40 17l-8 36" stroke="currentColor" strokeOpacity="0.66" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="landing-doodle shell shell-c">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 12C20 12 10 22 10 34c0 11 8 20 18 20h8c10 0 18-9 18-20C54 22 44 12 32 12Z" fill="currentColor" fillOpacity="0.3"/>
              <path d="M32 14v39M20 23l12 30M44 23 32 53" stroke="currentColor" strokeOpacity="0.62" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="landing-doodle shell shell-d">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 34c0-12 9-22 20-22s20 10 20 22c0 9-6 18-14 18H26c-8 0-14-9-14-18Z" fill="currentColor" fillOpacity="0.3"/>
              <path d="M32 14v38M22 20l10 32M42 20 32 52" stroke="currentColor" strokeOpacity="0.64" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="landing-doodle shell shell-e">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 35c0-12 9-22 20-22s20 10 20 22c0 9-6 17-14 17H26c-8 0-14-8-14-17Z" fill="currentColor" fillOpacity="0.3"/>
              <path d="M32 15v37M23 21l9 31M41 21 32 52" stroke="currentColor" strokeOpacity="0.63" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="landing-doodle jelly jelly-a">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 30c0-11 9-20 20-20s20 9 20 20H12Z" fill="currentColor" fillOpacity="0.34"/>
              <path d="M20 30v19M28 30v23M36 30v20M44 30v17" stroke="currentColor" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 30h32" stroke="currentColor" strokeOpacity="0.52" strokeWidth="2"/>
            </svg>
          </div>
          <div className="landing-doodle jelly jelly-b">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 30c0-10 8-18 18-18s18 8 18 18H14Z" fill="currentColor" fillOpacity="0.3"/>
              <path d="M22 30v18M30 30v20M38 30v16" stroke="currentColor" strokeOpacity="0.62" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="landing-doodle jelly jelly-c">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 31c0-10 8-19 19-19s19 9 19 19H13Z" fill="currentColor" fillOpacity="0.3"/>
              <path d="M22 31v16M30 31v19M38 31v16M46 31v13" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="landing-doodle jelly jelly-d">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 30c0-11 9-20 20-20s20 9 20 20H12Z" fill="currentColor" fillOpacity="0.3"/>
              <path d="M20 30v18M28 30v22M36 30v18M44 30v15" stroke="currentColor" strokeOpacity="0.62" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-12 backdrop-blur-sm">
            <Heart size={14} className="text-white" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold">Oceanic Wellness Sanctuary</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-medium text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
            Your Path to Better 
            <span className="block italic text-white/50 mt-2">Health & Wellness </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 font-serif italic mb-12 max-w-2xl mx-auto leading-relaxed">
            Breathe in the tranquility. Access personalized wellness programs and support services designed for the modern student.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-10 py-5 bg-white text-brand-primary rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all"
            >
              Log In
            </Link>
            <button 
              onClick={() => { setShowSignUp(true); setSignUpStep(1); }}
              className="w-full sm:w-auto px-10 py-5 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Features */}
      <section className="py-32 px-6 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-6">Why Choose Our Platform?</h2>
            <p className="text-stone-500 font-serif italic text-lg max-w-2xl mx-auto">
              Comprehensive wellness support tailored to the unique needs of university students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Personalized Care',
                desc: 'Access resources and programs tailored to your individual wellness journey and goals.',
                icon: Heart,
                color: 'bg-teal-50 text-teal-600'
              },
              {
                title: 'Expert Support',
                desc: 'Connect with trained professionals who understand student life and mental health.',
                icon: Users,
                color: 'bg-orange-50 text-orange-600'
              },
              {
                title: 'Safe & Confidential',
                desc: 'Your privacy and security are our top priorities. All information is kept confidential.',
                icon: Shield,
                color: 'bg-stone-50 text-stone-600'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 rounded-[3rem] border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all group"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-medium text-stone-900 mb-6">{feature.title}</h3>
                <p className="text-stone-500 font-serif italic leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: CTA & Footer */}
      <section className="relative pt-32 bg-linear-to-t from-[#004d40] to-brand-primary overflow-hidden">
        {/* CTA Area */}
        <div className="px-6 pb-32 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <Sparkles size={48} className="text-orange-300 mx-auto mb-8" strokeWidth={1} />
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-white mb-8">Ready to Start Your Wellness Journey?</h2>
              <p className="text-white/60 font-serif italic text-xl mb-12 max-w-2xl mx-auto">
                Join thousands of students who are taking control of their health and well-being.
              </p>
              <button 
                onClick={() => { setShowSignUp(true); setSignUpStep(1); }}
                className="inline-flex items-center gap-3 px-12 py-6 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all"
              >
                Get Started Today
              </button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 px-6 py-20 bg-[#002d26]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <Heart size={24} className="text-teal-400" />
                  <span className="text-2xl font-serif font-medium text-white">Oceanic Wellness</span>
                </div>
                <p className="text-white/40 font-serif italic max-w-xs">
                  Supporting student health and well-being across campus.
                </p>
              </div>

              <div>
                <h4 className="text-white text-[10px] uppercase tracking-widest font-bold mb-8">Quick Links</h4>
                <ul className="space-y-4 text-white/50 text-sm font-serif italic">
                  <li><Link to="/login" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Resources</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Support</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white text-[10px] uppercase tracking-widest font-bold mb-8">Emergency</h4>
                <p className="text-white/50 text-sm font-serif italic mb-4">If you&apos;re in crisis, call:</p>
                <p className="text-white text-xl font-serif font-medium">988 - Crisis Hotline</p>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 text-center">
              <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
                © 2026 Oceanic Wellness Sanctuary. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </section>

      {/* Sign Up Modal */}
      <AnimatePresence>
        {showSignUp && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignUp(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowSignUp(false)}
                className="absolute top-8 right-8 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-12">
                {signUpStep === 1 ? (
                  <div className="text-center">
                    <h2 className="text-4xl font-serif font-medium text-stone-900 mb-4">Join the Sanctuary</h2>
                    <p className="text-stone-500 font-serif italic mb-12">Choose your path in our wellness community.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <button 
                        onClick={() => { setFormData({...formData, role: 'student'}); setSignUpStep(2); }}
                        className="p-8 bg-teal-50 border border-teal-100 rounded-4xl text-center group hover:bg-teal-100 transition-all"
                      >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-6 shadow-sm">
                          <Users size={24} />
                        </div>
                        <h3 className="text-xl font-serif font-medium text-stone-900 mb-2">I want to be a student</h3>
                        <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">Access Resources</p>
                      </button>

                      <button 
                        onClick={() => {
                          setShowSignUp(false);
                          setSignUpStep(1);
                          setSignUpError('');
                          setFormData({ name: '', username: '', email: '', password: '', age: '', role: '' });
                          navigate('/admin-signup', { replace: true });
                        }}
                        className="p-8 bg-orange-50 border border-orange-100 rounded-4xl text-center group hover:bg-orange-100 transition-all"
                      >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6 shadow-sm">
                          <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-serif font-medium text-stone-900 mb-2">I want to be an admin</h3>
                        <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">Manage Content</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-10">
                      <h2 className="text-4xl font-serif font-medium text-stone-900 mb-4">Tell us about yourself</h2>
                      <p className="text-stone-500 font-serif italic">We&apos;ll tailor your experience to your needs.</p>
                    </div>

                    <form onSubmit={handleSignUpSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                          <input 
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-14 pr-6 py-3 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                            placeholder="Alex Johnson"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Username</label>
                          <div className="relative">
                            <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                            <input 
                              type="text"
                              required
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              className="w-full pl-14 pr-6 py-3 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                              placeholder="alexj"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Age</label>
                          <div className="relative">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                            <input 
                              type="number"
                              required
                              value={formData.age}
                              onChange={(e) => setFormData({...formData, age: e.target.value})}
                              className="w-full pl-14 pr-6 py-3 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                              placeholder="21"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                          <input 
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-14 pr-6 py-3 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                            placeholder="alex@university.edu"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                          <input 
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-14 pr-6 py-3 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {signUpError && (
                        <div className="p-4 bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest rounded-2xl text-center border border-red-100">
                          {signUpError}
                        </div>
                      )}

                      <div className="pt-4 flex gap-4">
                        <button 
                          type="button"
                          onClick={() => setSignUpStep(1)}
                          className="flex-1 py-5 border border-stone-100 text-stone-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 transition-all"
                        >
                          Back
                        </button>
                        <button 
                          type="submit"
                          disabled={signingUp}
                          className="flex-2 py-5 bg-teal-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                        >
                          {signingUp ? 'Creating Account...' : 'Complete Registration'}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
