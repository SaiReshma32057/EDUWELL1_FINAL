import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Calendar, ArrowRight, CheckCircle2, Anchor } from 'lucide-react';

export default function WellnessPrograms() {
  const [programs, setPrograms] = useState([]);
  const [myPrograms, setMyPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const mockPrograms = [
      {
        id: 1,
        title: "30-Day Mindfulness Reset",
        description: "Build clarity and focus with daily guided practices.",
        category: "Mental Health",
        duration_days: 30
      },
      {
        id: 2,
        title: "Fitness Foundation Bootcamp",
        description: "Strengthen your body with structured workouts.",
        category: "Fitness",
        duration_days: 21
      },
      {
        id: 3,
        title: "Sleep Optimization Journey",
        description: "Transform your sleep habits for academic success.",
        category: "Sleep",
        duration_days: 14
      }
    ];
  
    setPrograms(mockPrograms);
    setMyPrograms([]); // initially not enrolled
    setLoading(false);
  }, []);

  const handleEnroll = async (programId) => {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({ programId })
    });
    if (res.ok) {
      // Refresh my programs
      const myRes = await fetch('/api/my-programs', { 
        headers: { 'x-user-id': user.id.toString() } 
      });
      setMyPrograms(await myRes.json());
    }
  };

  const isEnrolled = (programId) => myPrograms.some(p => p.id === programId);

  if (loading) return <div className="p-8 text-center">Loading programs...</div>;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-teal-600 font-bold mb-3">Tides of Change</p>
          <h1 className="text-5xl font-serif font-medium text-stone-900 leading-tight">Oceanic <span className="italic text-[var(--color-brand-accent)]">Expeditions</span></h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {programs.map(program => {
          const enrolled = isEnrolled(program.id);
          return (
            <motion.div
              key={program.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[3rem] border border-stone-100 elegant-shadow overflow-hidden flex flex-col group"
            >
              <div className="h-64 bg-stone-50 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${program.id}/800/400`} 
                  alt={program.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-5 py-2 bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                    {program.category}
                  </span>
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-serif font-medium text-stone-900 mb-4 leading-snug">{program.title}</h3>
                <p className="text-stone-500 mb-8 flex-1 italic font-serif leading-relaxed">{program.description}</p>
                
                <div className="flex gap-8 mb-10">
                  <div className="flex items-center gap-3 text-stone-400">
                    <Calendar size={18} strokeWidth={1.5} className="text-[var(--color-brand-accent)]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">{program.duration_days} Days</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-400">
                    <Users size={18} strokeWidth={1.5} className="text-[var(--color-brand-accent)]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">1.2k Enrolled</span>
                  </div>
                </div>

                {enrolled ? (
                  <div className="flex items-center justify-center gap-3 py-5 bg-stone-50 text-[var(--color-brand-primary)] rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-stone-100">
                    <CheckCircle2 size={18} strokeWidth={1.5} />
                    Journey Commenced
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(program.id)}
                    className="w-full py-5 bg-[var(--color-brand-primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-stone-200 hover:opacity-90 transition-all flex items-center justify-center gap-3 group"
                  >
                    Begin Journey
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
              {/* Subtle beach icon in background */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                  <Anchor size={120} className="rotate-12" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <section className="bg-[var(--color-brand-primary)] rounded-[4rem] p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-stone-200">
        <div className="relative z-10">
          <Trophy size={48} strokeWidth={1} className="mx-auto mb-8 text-[var(--color-brand-accent)]" />
          <h2 className="text-4xl font-serif font-medium mb-6">Ready for a <span className="italic text-[var(--color-brand-accent)]">Challenge?</span></h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10 font-serif italic text-lg leading-relaxed">
            Join our collective of students in monthly wellness challenges and earn distinctive marks for your identity.
          </p>
          <button className="px-12 py-5 bg-white text-[var(--color-brand-primary)] rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-stone-50 transition-colors">
            Explore Challenges
          </button>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-[120px]" />
        </div>
      </section>
    </div>
  );
}
