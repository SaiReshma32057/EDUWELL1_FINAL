import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, CalendarDays } from 'lucide-react';

export default function ManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: '',
    durationDays: 7,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const fallbackUserId = localStorage.getItem('userId');
  const effectiveUserId = user.id || fallbackUserId;

  useEffect(() => {
    fetchSessions();
  }, [effectiveUserId]);

  const fetchSessions = async () => {
    if (!effectiveUserId) {
      setLoading(false);
      setError('Admin session is missing. Please login again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/sessions', {
        headers: { 'x-user-id': String(effectiveUserId) },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Unable to load sessions');
        return;
      }
      setSessions(data);
    } catch {
      setError('Unable to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', category: '', durationDays: 7 });
    setShowForm(true);
  };

  const openEdit = (session) => {
    setEditingId(session.id);
    setForm({
      title: session.title || '',
      category: session.category || '',
      durationDays: session.durationDays || 7,
    });
    setShowForm(true);
  };

  const saveSession = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const endpoint = editingId ? `/api/admin/sessions/${editingId}` : '/api/admin/sessions';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(effectiveUserId || ''),
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          durationDays: Number(form.durationDays),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to save session');
        return;
      }

      setShowForm(false);
      await fetchSessions();
    } catch {
      setError('Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  const deleteSession = async (id) => {
    setError('');
    try {
      const res = await fetch(`/api/admin/sessions/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': String(effectiveUserId || '') },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to delete session');
        return;
      }

      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch {
      setError('Failed to delete session');
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return true;
    }

    return (
      (session.title || '').toLowerCase().includes(q) ||
      (session.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900">Session Management</h1>
          <p className="text-stone-500 mt-1 font-serif italic">Create, edit, and remove student wellness sessions.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
          <Plus size={20} />
          Add Session
        </button>
      </header>

      {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={saveSession} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Session title" className="px-4 py-3 rounded-xl border border-slate-200" required />
          <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" className="px-4 py-3 rounded-xl border border-slate-200" required />
          <input type="number" min="1" value={form.durationDays} onChange={(e) => setForm((prev) => ({ ...prev, durationDays: e.target.value }))} placeholder="Duration in days" className="md:col-span-2 px-4 py-3 rounded-xl border border-slate-200" required />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Update Session' : 'Create Session'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr>
                  <td className="px-6 py-6 text-slate-500" colSpan={4}>Loading sessions...</td>
                </tr>
              )}
              {!loading && filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{session.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase">
                      {session.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{session.durationDays} days</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(session)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteSession(session.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredSessions.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-slate-500" colSpan={4}>No sessions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
