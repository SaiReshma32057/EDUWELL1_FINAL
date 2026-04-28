import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Globe, Lock } from 'lucide-react';

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    type: 'article',
    contentUrl: '',
    isPublished: true,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const fallbackUserId = localStorage.getItem('userId');
  const effectiveUserId = user.id || fallbackUserId;

  useEffect(() => {
    fetchResources();
  }, [effectiveUserId]);

  const fetchResources = async () => {
    if (!effectiveUserId) {
      setLoading(false);
      setError('Admin session is missing. Please login again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/resources', {
        headers: { 'x-user-id': String(effectiveUserId) },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Unable to load resources');
        return;
      }
      setResources(data);
    } catch {
      setError('Unable to load resources');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      category: '',
      type: 'article',
      contentUrl: '',
      isPublished: true,
    });
    setShowForm(true);
  };

  const openEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || '',
      type: resource.type || 'article',
      contentUrl: resource.content_url || resource.contentUrl || '',
      isPublished: Boolean(resource.is_published),
    });
    setShowForm(true);
  };

  const saveResource = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const endpoint = editingId ? `/api/admin/resources/${editingId}` : '/api/admin/resources';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(effectiveUserId || ''),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to save resource');
        return;
      }

      setShowForm(false);
      await fetchResources();
    } catch {
      setError('Failed to save resource');
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (id) => {
    setError('');
    try {
      const res = await fetch(`/api/admin/resources/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': String(effectiveUserId || '') },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to delete resource');
        return;
      }

      setResources((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError('Failed to delete resource');
    }
  };

  const filteredResources = resources.filter((res) => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return (
      (res.title || '').toLowerCase().includes(q) ||
      (res.category || '').toLowerCase().includes(q) ||
      (res.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900">Curate the Sanctuary</h1>
          <p className="text-stone-500 mt-1 font-serif italic">Create, edit, and publish wellness content.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all">
          <Plus size={20} />
          Add New Resource
        </button>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-sm">{error}</div>
      )}

      {showForm && (
        <form onSubmit={saveResource} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" className="px-4 py-3 rounded-xl border border-slate-200" required />
          <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" className="px-4 py-3 rounded-xl border border-slate-200" required />
          <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} className="px-4 py-3 rounded-xl border border-slate-200" required>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
          </select>
          <input value={form.contentUrl} onChange={(e) => setForm((prev) => ({ ...prev, contentUrl: e.target.value }))} placeholder="Content URL" className="px-4 py-3 rounded-xl border border-slate-200" required />
          <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" className="md:col-span-2 px-4 py-3 rounded-xl border border-slate-200 min-h-24" required />
          <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))} />
            Published
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Update Resource' : 'Create Resource'}
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
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr>
                  <td className="px-6 py-6 text-slate-500" colSpan={5}>Loading resources...</td>
                </tr>
              )}
              {!loading && filteredResources.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{res.title}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{res.description || 'No description'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase">
                      {res.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 capitalize">{res.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    {res.is_published ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Globe size={14} /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                        <Lock size={14} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(res)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteResource(res.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredResources.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-slate-500" colSpan={5}>No resources found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
