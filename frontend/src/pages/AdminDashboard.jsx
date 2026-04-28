import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Trophy, TrendingUp, Sparkles, UserCheck, Plus, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewUpdateForm, setShowNewUpdateForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    name: '',
    updateAbout: 'Nutrition',
    conciergeDetails: '',
    message: '',
  });
  const [announcementStatus, setAnnouncementStatus] = useState({ type: '', message: '' });
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const fallbackUserId = localStorage.getItem('userId');
  const effectiveUserId = user.id || fallbackUserId;

  useEffect(() => {
    setAnnouncementForm((prev) => ({
      ...prev,
      name: user?.name || 'Admin',
    }));
  }, [user?.name]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!effectiveUserId) {
        setError('Admin session is missing. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: { 'x-user-id': String(effectiveUserId) },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Unable to load admin dashboard data');
          return;
        }

        setStats(data);
      } catch {
        setError('Unable to load admin dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [effectiveUserId]);

  const onAnnouncementChange = (key, value) => {
    setAnnouncementForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitAnnouncement = async (event) => {
    event.preventDefault();
    setAnnouncementStatus({ type: '', message: '' });

    try {
      setAnnouncementSubmitting(true);
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(effectiveUserId),
        },
        body: JSON.stringify(announcementForm),
      });

      const payload = await response.json();
      if (!response.ok) {
        setAnnouncementStatus({
          type: 'error',
          message: payload?.message || 'Unable to publish update',
        });
        return;
      }

      setAnnouncementStatus({
        type: 'success',
        message: 'Update published. Students can now see the new update by admin.',
      });
      setAnnouncementForm((prev) => ({
        ...prev,
        updateAbout: 'Nutrition',
        conciergeDetails: '',
        message: '',
      }));
    } catch {
      setAnnouncementStatus({ type: 'error', message: 'Unable to publish update' });
    } finally {
      setAnnouncementSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading admin insights...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const chartData = (stats.resourceUsage || []).map((item) => ({
    name: item.title.length > 14 ? `${item.title.slice(0, 14)}...` : item.title,
    usage: item.usageCount,
  }));

  const statCards = [
    { label: 'Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-500' },
    { label: 'Sessions', value: stats.totalSessions, icon: Trophy, color: 'bg-emerald-500' },
    { label: 'Resources', value: stats.totalResources, icon: BookOpen, color: 'bg-orange-500' },
    { label: 'Counselors', value: stats.totalCounselors, icon: UserCheck, color: 'bg-purple-500' },
    { label: 'Active Users', value: stats.activeUsers, icon: Sparkles, color: 'bg-teal-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900">Sanctuary Curator Panel</h1>
          <p className="text-stone-500 mt-1 font-serif italic">Platform-wide wellness metrics and analytics.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={() => setShowNewUpdateForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            New
          </button>
          <div className="px-6 py-3 bg-white border border-stone-200 text-stone-600 rounded-2xl font-bold shadow-sm">
            Total Resource Usage: {stats.totalResourceUsage || 0}
          </div>
        </div>
      </header>

      {showNewUpdateForm && (
        <section className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">New Update for Students</h2>
            <p className="text-xs uppercase tracking-wider text-slate-500 mt-1">Curator panel announcement</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submitAnnouncement}>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</span>
              <input
                type="text"
                value={announcementForm.name}
                onChange={(event) => onAnnouncementChange('name', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Admin name"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Update About</span>
              <select
                value={announcementForm.updateAbout}
                onChange={(event) => onAnnouncementChange('updateAbout', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                required
              >
                <option value="Nutrition">Nutrition</option>
                <option value="Fitness">Fitness</option>
                <option value="Mental Health">Mental Health</option>
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Concierge Details</span>
              <input
                type="text"
                value={announcementForm.conciergeDetails}
                onChange={(event) => onAnnouncementChange('conciergeDetails', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="What should concierge support know?"
                required
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Additional Message (Optional)</span>
              <textarea
                value={announcementForm.message}
                onChange={(event) => onAnnouncementChange('message', event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Share extra context with students"
              />
            </label>

            {announcementStatus.message && (
              <p className={`md:col-span-2 text-sm font-semibold ${announcementStatus.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                {announcementStatus.message}
              </p>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={announcementSubmitting}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-60"
              >
                <Send size={15} />
                {announcementSubmitting ? 'Publishing...' : 'Publish Update'}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <TrendingUp size={14} />
                Live
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Resource Usage</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="usage" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {(stats.recentActivities || []).map((item, index) => (
              <div key={`${item.type}-${index}`} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{item.message}</p>
                </div>
                <span className="text-slate-500 text-xs font-bold whitespace-nowrap">
                  {item.type}
                </span>
              </div>
            ))}
            {(stats.recentActivities || []).length === 0 && (
              <p className="text-sm text-slate-500">No updates yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
