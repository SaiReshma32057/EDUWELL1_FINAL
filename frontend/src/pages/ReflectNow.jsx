import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Trash2, ChevronDown, Calendar, Sparkles } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function ReflectNow() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    mood: '',
    feelings: '',
    thoughts: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const moodOptions = ['Calm', 'Anxious', 'Tired', 'Energized', 'Happy', 'Sad', 'Stressed', 'Focused'];

  // Fetch journal entries on mount
  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get('/api/journal/entries', {
        headers: { 'X-User-Id': userId }
      });
      if (response.data.status === 'success') {
        setJournalEntries(response.data.data || []);
      }
    } catch (error) {
      setErrorMessage('Failed to load journal entries');
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedMood = formData.mood.trim();
    const trimmedFeelings = formData.feelings.trim();
    const trimmedThoughts = formData.thoughts.trim();

    if (!trimmedMood || !trimmedFeelings || !trimmedThoughts) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.post('/api/journal/entries', {
        mood: trimmedMood,
        feelings: trimmedFeelings,
        thoughts: trimmedThoughts
      }, {
        headers: { 'X-User-Id': userId }
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Journal entry saved successfully!');
        setFormData({ mood: '', feelings: '', thoughts: '' });
        
        // Refresh entries
        setTimeout(() => {
          fetchJournalEntries();
          setSuccessMessage('');
        }, 1500);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to save journal entry');
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axiosInstance.delete(`/api/journal/entries/${entryId}`, {
          headers: { 'X-User-Id': userId }
        });

        if (response.data.status === 'success') {
          setJournalEntries(journalEntries.filter(e => e.id !== entryId));
          setSuccessMessage('Entry deleted successfully');
          setTimeout(() => setSuccessMessage(''), 2000);
        }
      } catch (error) {
        setErrorMessage('Failed to delete entry');
        console.error('Error deleting entry:', error);
      }
    }
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      'Calm': '😌',
      'Anxious': '😰',
      'Tired': '😴',
      'Energized': '⚡',
      'Happy': '😊',
      'Sad': '😢',
      'Stressed': '😤',
      'Focused': '🎯'
    };
    return moodMap[mood] || '💭';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="text-center space-y-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-teal-600 font-bold">Mental Well-being</p>
        <h1 className="text-5xl font-serif font-medium text-stone-900">
          Reflect & <span className="italic text-brand-accent">Connect</span>
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto font-serif italic">
          Take a moment to journal your feelings. Your thoughts, saved securely with your account.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Journal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-white to-stone-50 p-10 rounded-[3rem] border border-stone-100 elegant-shadow"
        >
          <h2 className="text-3xl font-serif font-medium text-stone-900 mb-8 flex items-center gap-3">
            <Sparkles size={28} className="text-teal-500" />
            Today's Reflection
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-bold uppercase tracking-widest text-stone-600">
                How are you feeling?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {moodOptions.map(mood => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mood }))}
                    className={`py-3 px-2 rounded-2xl text-center font-serif text-sm transition-all border-2 flex flex-col items-center justify-center gap-2 ${
                      formData.mood === mood
                        ? 'bg-brand-primary text-white border-brand-primary shadow-lg'
                        : 'bg-white text-stone-600 border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <span className="text-xl">{getMoodEmoji(mood)}</span>
                    <span className="text-xs">{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feelings Input */}
            <div className="space-y-3">
              <label htmlFor="feelings" className="block text-sm font-bold uppercase tracking-widest text-stone-600">
                Describe your feelings
              </label>
              <textarea
                id="feelings"
                name="feelings"
                value={formData.feelings}
                onChange={handleInputChange}
                placeholder="What emotions are you experiencing right now?"
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary font-serif text-sm resize-none h-24 transition-all"
              />
              <p className="text-xs text-stone-400">
                {formData.feelings.length}/500 characters
              </p>
            </div>

            {/* Thoughts Input */}
            <div className="space-y-3">
              <label htmlFor="thoughts" className="block text-sm font-bold uppercase tracking-widest text-stone-600">
                What's on your mind?
              </label>
              <textarea
                id="thoughts"
                name="thoughts"
                value={formData.thoughts}
                onChange={handleInputChange}
                placeholder="Share your thoughts, worries, or reflections..."
                className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary font-serif text-sm resize-none h-32 transition-all"
              />
              <p className="text-xs text-stone-400">
                {formData.thoughts.length} characters
              </p>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-serif">
                ✓ {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-serif">
                ✗ {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Reflection'}
            </button>
          </form>
        </motion.div>

        {/* Journal Entries History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-serif font-medium text-stone-900 flex items-center gap-3">
            <Heart size={28} className="text-red-400" />
            Your Reflections
          </h2>

          {loading ? (
            <div className="text-center py-12 text-stone-400 font-serif italic">
              Loading your reflections...
            </div>
          ) : journalEntries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2.5rem] border border-dashed border-stone-100 text-stone-400 font-serif italic">
              No reflections yet. Start by saving your first entry!
            </div>
          ) : (
            <div className="space-y-4 max-h-175 overflow-y-auto pr-2">
              {journalEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-4xl border border-stone-100 overflow-hidden elegant-shadow hover:shadow-xl transition-all"
                >
                  <button
                    onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                    className="w-full p-6 flex items-start justify-between hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
                            {entry.mood}
                          </p>
                          <p className="text-stone-500 text-xs flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-stone-700 font-serif text-sm line-clamp-2">
                        {entry.feelings}
                      </p>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-stone-300 transition-transform ${
                        expandedEntry === entry.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedEntry === entry.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-6 pb-6 border-t border-stone-100 bg-stone-50 space-y-4"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2">
                          Feelings
                        </p>
                        <p className="text-stone-700 font-serif text-sm leading-relaxed">
                          {entry.feelings}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2">
                          Thoughts
                        </p>
                        <p className="text-stone-700 font-serif text-sm leading-relaxed">
                          {entry.thoughts}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete Entry
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
