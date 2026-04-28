import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Utensils, Calculator, Apple, Download, ChevronRight, Sparkles, Anchor, Waves, Heart, Activity } from 'lucide-react';

export default function NutritionAdvice() {
  const [details, setDetails] = useState({ height: '', weight: '', age: '', activity: 'moderate', goal: 'maintain' });
  const [bmi, setBmi] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (details.weight && details.height) {
      const h = details.height / 100;
      const result = (details.weight / (h * h)).toFixed(1);
      setBmi(result);
    }
  };

  const dietPlans = [
    { meal: 'Breakfast', suggestion: 'Greek yogurt with honey and tropical fruits.', cal: 350 },
    { meal: 'Lunch', suggestion: 'Grilled chicken wrap with avocado and greens.', cal: 550 },
    { meal: 'Dinner', suggestion: 'Baked salmon with roasted sweet potatoes.', cal: 600 },
    { meal: 'Snack', suggestion: 'A handful of almonds or a fresh apple.', cal: 150 }
  ];

  const cravings = [
    { crave: 'Salty Chips', alternative: 'Seaweed snacks or air-popped popcorn.', icon: Waves },
    { crave: 'Sweet Candy', alternative: 'Frozen grapes or a small piece of dark chocolate.', icon: Heart },
    { crave: 'Fizzy Soda', alternative: 'Sparkling water with a splash of lime.', icon: Sparkles },
    { crave: 'Fried Food', alternative: 'Air-fried veggie chips or roasted chickpeas.', icon: Anchor }
  ];

  const exercises = [
    { title: 'Morning Stretch', desc: '5 mins of gentle flow to wake up your body.', icon: Waves, type: 'Yoga' },
    { title: 'Dorm Room Cardio', desc: '15 mins of high-intensity bodyweight moves.', icon: Activity, type: 'HIIT' },
    { title: 'Shoreline Strength', desc: 'Basic squats, lunges, and push-ups.', icon: Anchor, type: 'Strength' },
    { title: 'Sunset Yoga', desc: 'Relaxing poses to wind down after classes.', icon: Heart, type: 'Yoga' }
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-teal-600 font-bold mb-3">Oceanic Nourishment</p>
          <h1 className="text-5xl font-serif font-medium text-stone-900 leading-tight">The Nourishing <span className="italic text-[var(--color-brand-accent)]">Reef</span></h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Physical Details & BMI */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400">
                  <Calculator size={24} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-serif font-medium text-stone-800">Physical Details</h2>
              </div>
              <form onSubmit={calculateBMI} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={details.weight}
                      onChange={(e) => setDetails({...details, weight: e.target.value})}
                      className="w-full px-6 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/10 font-medium text-stone-700"
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Height (cm)</label>
                    <input
                      type="number"
                      value={details.height}
                      onChange={(e) => setDetails({...details, height: e.target.value})}
                      className="w-full px-6 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/10 font-medium text-stone-700"
                      placeholder="175"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Age</label>
                    <input
                      type="number"
                      value={details.age}
                      onChange={(e) => setDetails({...details, age: e.target.value})}
                      className="w-full px-6 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/10 font-medium text-stone-700"
                      placeholder="21"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Activity</label>
                    <select
                      value={details.activity}
                      onChange={(e) => setDetails({...details, activity: e.target.value})}
                      className="w-full px-6 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/10 font-medium text-stone-700 appearance-none"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">Fitness Goal</label>
                  <select
                    value={details.goal}
                    onChange={(e) => setDetails({...details, goal: e.target.value})}
                    className="w-full px-6 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/10 font-medium text-stone-700 appearance-none"
                  >
                    <option value="lose">Weight Loss</option>
                    <option value="maintain">Maintain Health</option>
                    <option value="gain">Muscle Gain</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[var(--color-brand-primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-teal-100 hover:opacity-90 transition-all"
                >
                  Update & Calculate
                </button>
              </form>

              {bmi && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-stone-50 rounded-2xl text-center border border-stone-100"
                >
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Your BMI</p>
                  <p className="text-4xl font-serif font-medium text-stone-900">{bmi}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--color-brand-accent)] font-bold mt-2 italic">
                    {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Optimal' : bmi < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </motion.div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-[0.02]">
              <Anchor size={120} />
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow">
            <h3 className="text-xl font-serif font-medium text-stone-800 mb-8 flex items-center gap-3">
              <Sparkles size={20} className="text-orange-400" />
              Healthy Habits
            </h3>
            <div className="space-y-4">
              {[
                "Drink 2L of water daily",
                "Eat 5 servings of fruit/veg",
                "Mindful portion control",
                "Balanced macronutrients"
              ].map((habit, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="text-sm font-serif italic text-stone-700">{habit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Nutrition Planning & Cravings */}
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-[var(--color-brand-primary)] text-white p-12 rounded-[4rem] overflow-hidden relative shadow-2xl shadow-teal-100">
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-medium mb-8 flex items-center gap-4">
                <Utensils size={32} strokeWidth={1.5} className="text-orange-300" />
                Student Diet Plans
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dietPlans.map((plan, i) => (
                  <div key={i} className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-serif font-medium">{plan.meal}</h4>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">{plan.cal} kcal</span>
                    </div>
                    <p className="text-sm text-white/80 font-serif italic leading-relaxed">{plan.suggestion}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <button className="flex items-center gap-3 px-10 py-5 bg-white text-[var(--color-brand-primary)] rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-stone-50 transition-colors">
                  <Download size={18} strokeWidth={1.5} />
                  Download Full Guide
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-[0.05] rotate-12">
              <Utensils size={300} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium text-stone-800 mb-10 flex items-center gap-4">
              <Apple size={24} strokeWidth={1.5} className="text-[var(--color-brand-accent)]" />
              Craving Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cravings.map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 elegant-shadow flex items-center gap-6 group hover:border-teal-200 transition-all">
                  <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform">
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Craving {item.crave}</p>
                    <p className="text-lg font-serif font-medium text-stone-900">Try {item.alternative}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium text-stone-800 mb-10 flex items-center gap-4">
              <Activity size={24} strokeWidth={1.5} className="text-teal-500" />
              Movement & Flow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exercises.map((ex, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-stone-100 elegant-shadow hover:border-teal-200 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <span className="px-4 py-1.5 bg-stone-50 text-stone-400 text-[9px] font-bold uppercase tracking-widest rounded-full border border-stone-100">{ex.type}</span>
                      <span className="text-stone-300 group-hover:text-teal-500 transition-colors"><ChevronRight size={20} /></span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                        <ex.icon size={24} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl font-serif font-medium text-stone-900 leading-snug">{ex.title}</h3>
                    </div>
                    <p className="text-sm text-stone-500 font-serif italic leading-relaxed">{ex.desc}</p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                    <Waves size={100} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
