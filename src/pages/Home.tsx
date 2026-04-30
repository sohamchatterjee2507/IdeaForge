import { motion } from 'motion/react';
import { Lightbulb, Rocket, Target, Users, ArrowRight, Zap, ShieldCheck, Cpu } from 'lucide-react';
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
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
            alt="Engineering Workspace" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-mono mb-6"
            >
              <Zap className="w-3 h-3" />
              <span className="tracking-widest uppercase">Platform for Future Engineers</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
            >
              Forge Your Path with <span className="text-brand-yellow">Elite Projects.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-neutral-400 mb-10 leading-relaxed"
            >
              The ultimate marketplace for engineering students to discover high-quality project ideas, full documentation, and implementation guides for internships and academic excellence.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/explore" className="inline-flex items-center justify-center px-8 py-4 bg-brand-yellow text-neutral-900 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 glow-yellow">
                Explore Marketplace <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold transition-all hover:bg-white/10">
                How it Works
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Targeted Domains", desc: "Curated ideas across AI, Web, IoT, Mechanical, and Civil engineering." },
            { icon: ShieldCheck, title: "Verified Ideas", desc: "Every project is vetted by industry professionals for academic rigor." },
            { icon: Cpu, title: "Full Resources", desc: "Complete implementation steps, source links, and resource lists included." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-neutral-800/20 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Ideas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
            <p className="text-neutral-500">Trending project ideas for the current semester.</p>
          </div>
          <Link to="/explore" className="hidden sm:flex items-center text-brand-yellow font-bold uppercase tracking-widest text-xs hover:gap-2 transition-all">
            View All Marketplace <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {featuredIdeas.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-800/10 border border-dashed border-neutral-800 rounded-3xl">
            <Lightbulb className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-600">No projects listed yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
