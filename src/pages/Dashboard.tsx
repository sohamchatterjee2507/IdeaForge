import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { ideaService } from '../lib/ideaService';
import { Idea, IdeaContent } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Loader2, 
  LayoutGrid,
  Settings,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { profile } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIdea, setNewIdea] = useState<Partial<Idea>>({
    title: '',
    description: '',
    domain: 'AI/ML',
    difficulty: 'Beginner',
    price: 0,
  });
  const [newContent, setNewContent] = useState<IdeaContent>({
    resources: '',
    implementationSteps: '',
  });

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchIdeas();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const fetchIdeas = async () => {
    setLoading(true);
    const data = await ideaService.getAllIdeas();
    setIdeas(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    await ideaService.createIdea({
      title: newIdea.title!,
      description: newIdea.description!,
      domain: newIdea.domain!,
      difficulty: newIdea.difficulty as any,
      price: Number(newIdea.price),
      createdBy: profile.uid,
    }, newContent);
    
    setShowAddModal(false);
    fetchIdeas();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this idea?')) {
      await ideaService.deleteIdea(id);
      fetchIdeas();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
      </div>
    );
  }

  if (profile?.role === 'student') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-neutral-500">Manage your learning and profile settings.</p>
        </header>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-neutral-800/40 border border-neutral-800">
             <Settings className="w-8 h-8 text-neutral-600 mb-6" />
             <h3 className="font-bold mb-2">Profile Settings</h3>
             <p className="text-neutral-500 text-sm mb-6">Update your personal information and preferences.</p>
             <button className="text-brand-yellow text-sm font-bold uppercase tracking-widest hover:underline">Edit Profile</button>
          </div>
          <div className="p-8 rounded-3xl bg-neutral-800/40 border border-neutral-800">
             <Code className="w-8 h-8 text-neutral-600 mb-6" />
             <h3 className="font-bold mb-2">My Learning</h3>
             <p className="text-neutral-500 text-sm mb-6">View all your purchased implementation guides.</p>
             <button className="text-brand-yellow text-sm font-bold uppercase tracking-widest hover:underline">View My Ideas</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Admin Control Center</h1>
          <p className="text-neutral-500">Manage the IdeaForge marketplace and track performance.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-brand-yellow text-neutral-900 rounded-xl font-bold hover:scale-105 transition-all glow-yellow"
        >
          <Plus className="w-5 h-5 mr-2" /> New Project Idea
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Ideas', value: ideas.length, icon: LayoutGrid },
          { label: 'Active Domains', value: new Set(ideas.map(i => i.domain)).size, icon: TrendingUp },
          { label: 'Total Sales', value: ideas.reduce((acc, i) => acc + i.purchaseCount, 0), icon: Users },
          { label: 'Revenue (Simulated)', value: `$${ideas.reduce((acc, i) => acc + (i.purchaseCount * i.price), 0).toLocaleString()}`, icon: DollarSign }
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-neutral-800/20 border border-neutral-800">
            <div className="flex items-center justify-between mb-4 text-neutral-500">
              <stat.icon className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold">System Metric</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-neutral-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ideas Table */}
      <div className="bg-neutral-800/40 border border-neutral-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-900/50 border-b border-neutral-800">
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-mono text-neutral-500">Title</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-mono text-neutral-500">Domain</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-mono text-neutral-500">Price</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-mono text-neutral-500">Sales</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest font-mono text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {ideas.map((idea) => (
                <tr key={idea.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium">{idea.title}</td>
                  <td className="px-6 py-4 text-neutral-400 text-sm">{idea.domain}</td>
                  <td className="px-6 py-4 font-mono text-brand-yellow font-bold">${idea.price}</td>
                  <td className="px-6 py-4 text-neutral-400 font-mono text-sm">{idea.purchaseCount}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-neutral-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button 
                      onClick={() => handleDelete(idea.id)}
                      className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-8">Forge New Project Idea</h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-neutral-500">Project Title</label>
                    <input 
                      required
                      type="text" 
                      value={newIdea.title}
                      onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-brand-yellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-neutral-500">Domain</label>
                    <select 
                      value={newIdea.domain}
                      onChange={(e) => setNewIdea({...newIdea, domain: e.target.value})}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-brand-yellow"
                    >
                      <option>AI/ML</option>
                      <option>Web Dev</option>
                      <option>Mobile</option>
                      <option>IoT</option>
                      <option>Mechanical</option>
                      <option>Electrical</option>
                      <option>Civil</option>
                      <option>Chemical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-neutral-500">Difficulty</label>
                    <select 
                      value={newIdea.difficulty}
                      onChange={(e) => setNewIdea({...newIdea, difficulty: e.target.value})}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-brand-yellow"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-neutral-500">Price (USD)</label>
                    <input 
                      required
                      type="number" 
                      value={newIdea.price}
                      onChange={(e) => setNewIdea({...newIdea, price: Number(e.target.value)})}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-brand-yellow"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-mono text-neutral-500">Short Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-brand-yellow resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-mono text-neutral-500">Implementation Steps (Markdown)</label>
                  <textarea 
                    required
                    rows={6}
                    value={newContent.implementationSteps}
                    onChange={(e) => setNewContent({...newContent, implementationSteps: e.target.value})}
                    placeholder="# Phase 1: Setup..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-brand-yellow font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-mono text-neutral-500">Resources & Tech Stack (Markdown)</label>
                  <textarea 
                    required
                    rows={3}
                    value={newContent.resources}
                    onChange={(e) => setNewContent({...newContent, resources: e.target.value})}
                    placeholder="- Python 3.10\n- TensorFlow\n- AWS S3"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 outline-none focus:border-brand-yellow font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-3 bg-brand-yellow text-neutral-900 rounded-xl font-bold glow-yellow"
                  >
                    Forge Idea
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
