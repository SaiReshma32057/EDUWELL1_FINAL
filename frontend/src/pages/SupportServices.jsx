import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Calendar, MessageSquare, ShieldAlert, Clock, User, X, Anchor, Waves, Heart, Sparkles, BookOpen, Users } from 'lucide-react';

export default function SupportServices() {
  const [appointments, setAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ counselorName: 'Dr. Sarah Smith', date: '', type: 'mental_health' });
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchAppointments = useCallback(async () => {
    const res = await fetch('/api/appointments', {
      headers: { 'x-user-id': user.id.toString() }
    });
    setAppointments(await res.json());
  }, [user.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleBook = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify(bookingData)
    });
    if (res.ok) {
      setShowBooking(false);
      fetchAppointments();
    }
  };

  const peerGroups = [
    { name: 'Oceanic Calm', topic: 'Anxiety Support', members: 12, icon: Waves },
    { name: 'The Study Reef', topic: 'Academic Focus', members: 25, icon: Anchor },
    { name: 'Mindful Tides', topic: 'Meditation Group', members: 18, icon: Sparkles }
  ];

  const academicSupport = [
    { title: 'Peer Tutoring', desc: 'Get help from fellow students in specific subjects.', icon: Users },
    { title: 'Study Skills', desc: 'Workshops on effective learning techniques.', icon: BookOpen },
    { title: 'Time Management', desc: 'Strategies to balance study and wellness.', icon: Clock }
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-teal-600 font-bold mb-3">Compassionate Tides</p>
          <h1 className="text-5xl font-serif font-medium text-stone-900 leading-tight">The Lighthouse <span className="italic text-[var(--color-brand-accent)]">Support</span></h1>
        </div>
        <button 
          onClick={() => setShowBooking(true)}
          className="px-10 py-5 bg-[var(--color-brand-primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-teal-100 hover:opacity-90 transition-all flex items-center gap-3"
        >
          <Calendar size={18} strokeWidth={1.5} />
          Book a Session
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Emergency & Peer Support */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-red-50/50 p-10 rounded-[3rem] border border-red-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 text-red-600">
                <ShieldAlert size={28} strokeWidth={1.5} />
                <h2 className="text-2xl font-serif font-medium">Emergency Support</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-red-100 elegant-shadow">
                  <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-1">Campus Security</p>
                  <p className="text-2xl font-serif font-medium text-stone-900 tracking-tight">555-0199</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-red-100 elegant-shadow">
                  <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-1">Crisis Hotline</p>
                  <p className="text-2xl font-serif font-medium text-stone-900 tracking-tight">1-800-WELLNESS</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-[0.05] text-red-600">
              <ShieldAlert size={120} />
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow">
            <h3 className="text-xl font-serif font-medium text-stone-800 mb-8 flex items-center gap-3">
              <Users size={24} strokeWidth={1.5} className="text-teal-500" />
              Peer Support Groups
            </h3>
            <div className="space-y-4">
              {peerGroups.map((group, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-teal-200 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform shadow-sm">
                    <group.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-serif font-medium text-stone-900">{group.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{group.topic} • {group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow">
            <h3 className="text-xl font-serif font-medium text-stone-800 mb-8">Quick Contacts</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-teal-500">
                  <PhoneCall size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">Health Center</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Mon-Fri, 9am - 5pm</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-teal-500">
                  <MessageSquare size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">Live Chat</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Available 24/7</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Professional & Academic Support */}
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow">
            <h2 className="text-2xl font-serif font-medium text-stone-800 mb-10 flex items-center gap-4">
              <Clock size={24} strokeWidth={1.5} className="text-[var(--color-brand-accent)]" />
              Your Scheduled Sessions
            </h2>
            <div className="space-y-6">
              {appointments.length > 0 ? appointments.map(app => (
                <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-stone-50/50 rounded-[2.5rem] border border-stone-100 group hover:bg-white hover:border-teal-200 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-full border border-stone-100 flex items-center justify-center text-stone-300 group-hover:text-teal-500 transition-colors">
                      <User size={32} strokeWidth={1} />
                    </div>
                    <div>
                      <h4 className="text-xl font-serif font-medium text-stone-900">{app.counselor_name}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1 capitalize">{app.type.replace('_', ' ')} Session</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-lg font-serif font-medium text-stone-900">{new Date(app.appointment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Scheduled</p>
                    </div>
                    <div className="px-5 py-2 bg-white text-teal-600 text-[9px] font-bold rounded-full uppercase tracking-[0.2em] border border-stone-100">
                      {app.status}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-[3rem]">
                  <p className="text-stone-400 font-serif italic text-lg">No sessions scheduled in your calendar.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium text-stone-800 mb-10 flex items-center gap-4">
              <BookOpen size={24} strokeWidth={1.5} className="text-teal-500" />
              Academic Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {academicSupport.map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 elegant-shadow flex flex-col items-center text-center group hover:border-teal-200 transition-all">
                  <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform mb-6">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-lg font-serif font-medium text-stone-900 mb-3">{item.title}</h4>
                  <p className="text-sm text-stone-500 font-serif italic leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[var(--color-brand-primary)] text-white p-12 rounded-[4rem] overflow-hidden relative shadow-2xl shadow-teal-100">
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-serif font-medium mb-6">Professional <span className="italic text-orange-300">Counseling</span></h2>
              <p className="text-white/80 font-serif italic text-lg leading-relaxed mb-8">
                Our certified professionals are here to guide you through any challenges you may face. Private, confidential, and supportive.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setShowBooking(true)} className="px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-stone-50 transition-colors">
                  Book Appointment
                </button>
                <button className="px-8 py-4 bg-white/10 border border-white/20 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition-colors">
                  Meet the Team
                </button>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-[0.1] rotate-12">
              <Heart size={240} />
            </div>
          </section>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone-900/20 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-serif font-medium text-stone-900">Book Support</h2>
              <button onClick={() => setShowBooking(false)} className="text-stone-300 hover:text-stone-900 transition-colors">
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={handleBook} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Select Counselor</label>
                <select 
                  className="w-full px-8 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/10 font-medium text-stone-700 appearance-none"
                  value={bookingData.counselorName}
                  onChange={(e) => setBookingData({...bookingData, counselorName: e.target.value})}
                >
                  <option>Dr. Sarah Smith</option>
                  <option>Prof. James Wilson</option>
                  <option>Counselor Maria Garcia</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Appointment Date</label>
                <input 
                  type="date"
                  required
                  className="w-full px-8 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/10 font-medium text-stone-700"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Session Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['mental_health', 'nutrition', 'fitness', 'general'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBookingData({...bookingData, type})}
                      className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        bookingData.type === type 
                        ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]' 
                        : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-[var(--color-brand-primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-teal-100 hover:opacity-90 transition-all mt-4"
              >
                Confirm Booking
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
