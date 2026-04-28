import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Award, History, Edit3, Save, Anchor } from 'lucide-react';

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    interests: user.interests || 'Mental Health, Fitness'
  });

  const handleSave = () => {
    // In a real app, we'd call an API
    setIsEditing(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-teal-600 font-bold mb-3">Personal Sanctuary</p>
          <h1 className="text-5xl font-serif font-medium text-stone-900 leading-tight">Your <span className="italic text-[var(--color-brand-accent)]">Identity</span></h1>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${
            isEditing 
            ? 'bg-[var(--color-brand-primary)] text-white shadow-xl shadow-stone-200' 
            : 'bg-white text-stone-600 border border-stone-100 hover:border-stone-200 elegant-shadow'
          }`}
        >
          {isEditing ? <Save size={16} strokeWidth={1.5} /> : <Edit3 size={16} strokeWidth={1.5} />}
          {isEditing ? 'Save Identity' : 'Edit Profile'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-12 rounded-[4rem] border border-stone-100 elegant-shadow text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-32 h-32 bg-stone-50 rounded-full mx-auto mb-8 flex items-center justify-center text-stone-200 border border-stone-50">
                <User size={64} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-serif font-medium text-stone-900 mb-2 tracking-tight">{formData.name}</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-brand-accent)] font-bold mb-8">{user.role}</p>
              <div className="flex justify-center gap-4">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 border border-stone-100" title="Wellness Warrior">
                  <Award size={24} strokeWidth={1.5} />
                </div>
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 border border-stone-100" title="Early Adopter">
                  <Shield size={24} strokeWidth={1.5} />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 opacity-[0.03] pointer-events-none">
              <Anchor size={120} />
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-accent)] to-transparent opacity-20" />
          </section>

          <section className="bg-[var(--color-brand-primary)] text-white p-12 rounded-[4rem] shadow-2xl shadow-stone-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-serif font-medium mb-8 flex items-center gap-4">
                <Award size={20} strokeWidth={1.5} className="text-[var(--color-brand-accent)]" />
                Achievements
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)]" />
                  <p className="text-sm text-white/70 font-serif italic">First Program Completed</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)]" />
                  <p className="text-sm text-white/70 font-serif italic">7 Day Wellness Streak</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16 blur-3xl" />
          </section>
        </div>

        {/* Details & Settings */}
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-white p-12 rounded-[4rem] border border-stone-100 elegant-shadow">
            <h3 className="text-2xl font-serif font-medium text-stone-800 mb-10">Personal Information</h3>
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1 flex items-center gap-2">
                    <User size={12} strokeWidth={1.5} /> Full Name
                  </label>
                  {isEditing ? (
                    <input 
                      type="text"
                      className="w-full px-8 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/10 font-medium text-stone-700"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-xl font-serif font-medium text-stone-900 px-1">{formData.name}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1 flex items-center gap-2">
                    <Mail size={12} strokeWidth={1.5} /> Email Address
                  </label>
                  <p className="text-xl font-serif font-medium text-stone-900 px-1">{formData.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1 flex items-center gap-2">
                  <Shield size={12} strokeWidth={1.5} /> Health Interests
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    className="w-full px-8 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/10 font-medium text-stone-700"
                    value={formData.interests}
                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                    placeholder="e.g. Mental Health, Fitness"
                  />
                ) : (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {formData.interests.split(',').map(interest => (
                      <span key={interest} className="px-5 py-2 bg-stone-50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-stone-100">
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white p-12 rounded-[4rem] border border-stone-100 elegant-shadow">
            <h3 className="text-2xl font-serif font-medium text-stone-800 mb-8 flex items-center gap-4">
              <History size={24} strokeWidth={1.5} className="text-stone-300" />
              Activity History
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-8 bg-stone-50/50 rounded-[2.5rem] border border-stone-100 group hover:bg-white transition-all">
                <div>
                  <p className="text-lg font-serif font-medium text-stone-900">Enrolled in 30-Day Mindfulness</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">2 days ago</p>
                </div>
                <span className="text-[var(--color-brand-primary)] font-bold text-[10px] uppercase tracking-widest">+50 XP</span>
              </div>
              <div className="flex items-center justify-between p-8 bg-stone-50/50 rounded-[2.5rem] border border-stone-100 group hover:bg-white transition-all">
                <div>
                  <p className="text-lg font-serif font-medium text-stone-900">Booked Support Session</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">1 week ago</p>
                </div>
                <span className="text-[var(--color-brand-primary)] font-bold text-[10px] uppercase tracking-widest">+20 XP</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
