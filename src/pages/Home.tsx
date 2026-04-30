import { motion } from 'motion/react';
import { Lightbulb, Target, ArrowRight, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ideaService } from '../lib/ideaService';
import { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';

export default function Home() {
  const [featuredIdeas, setFeaturedIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const ideas = await ideaService.getAllIdeas();
      setFeaturedIdeas(ideas.slice(0, 3));
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,192,45,0.05),transparent_50%)]" />
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
            alt="Engineering Workspace" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-black uppercase tracking-widest mb-8"
            >
              <Zap className="w-3 h-3" />
              <span>Forging the future of engineering</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] italic"
            >
              Forge Elite <br />
              <span className="text-brand-yellow underline decoration-brand-yellow/20">Blueprints.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-neutral-500 mb-12 max-w-2xl font-medium leading-relaxed"
            >
              The ultimate marketplace for engineering students to acquire high-grade project blueprints, tactical implementation guides, and industrial-standard resource kits.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link to="/explore" className="inline-flex items-center justify-center px-10 py-5 bg-brand-yellow text-neutral-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-yellow/20 italic">
                Enter Marketplace <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
              <Link to="/my-ideas" className="inline-flex items-center justify-center px-10 py-5 bg-neutral-900 text-white border border-neutral-800 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-neutral-800 transition-all italic">
                Your Forge
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: Target, title: "Tactical Domains", desc: "Forged across AI, Robotics, Embedded Systems, and Structural Engineering." },
            { icon: ShieldCheck, title: "Vetted Intelligence", desc: "Every blueprint is authenticated by industry veterans for industrial rigor." },
            { icon: Cpu, title: "System Blueprints", desc: "Full assembly instructions, source logic, and resource matrices included." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-10 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-brand-yellow/30 transition-all group"
            >
              <div className="absolute -top-6 left-10 w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center shadow-xl shadow-brand-yellow/20 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-neutral-900" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic mt-2">{feature.title}</h3>
              <p className="text-neutral-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Ideas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4 italic">Trending Forges</h2>
            <p className="text-neutral-500 font-medium">Strategically selected projects dominating the current engineering landscape.</p>
          </div>
          <Link to="/explore" className="hidden sm:flex items-center space-x-2 text-brand-yellow font-black uppercase text-xs tracking-widest group">
            <span>Access All Blueprints</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {featuredIdeas.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-neutral-900/50 border-4 border-dashed border-neutral-900 rounded-[3rem]">
            <Lightbulb className="w-20 h-20 text-neutral-800 mx-auto mb-8 animate-pulse" />
            <p className="text-neutral-600 font-bold uppercase tracking-widest">Awaiting new forge uploads...</p>
          </div>
        )}
      </section>
    </div>
  );
}
