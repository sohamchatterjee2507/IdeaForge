import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { ideaService } from '../lib/ideaService';
import { Idea, IdeaContent, Purchase } from '../types';
import { formatINR, toDate } from '../lib/utils';
import { 
  Trash2, 
  Loader2, 
  Database,
  PlusCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  ShieldAlert
} from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIdea, setNewIdea] = useState<Partial<Idea>>({
    title: '',
    description: '',
    domain: '',
    difficulty: 'Beginner',
    price: 0,
    visible: false,
    media: [],
  });
  const [newContent, setNewContent] = useState<IdeaContent>({
    implementationSteps: '',
    resources: '',
  });

  useEffect(() => {
    let active = true;
    
    const load = async () => {
      if (profile?.role === 'admin') {
        const [ideasData, purchasesData] = await Promise.all([
          ideaService.getAllIdeas(true),
          ideaService.getPurchases(true)
        ]);
        if (active) {
          setIdeas(ideasData);
          setPurchases(purchasesData);
          setLoading(false);
        }
      } else if (profile) {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [profile]);

  const fetchIdeas = async () => {
    const data = await ideaService.getAllIdeas(true);
    setIdeas(data);
  };

  const fetchPurchases = async () => {
    const data = await ideaService.getPurchases(true);
    setPurchases(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    if (!newIdea.title || !newIdea.domain || !newIdea.price) {
      alert('Title, Domain, and Price are required.');
      return;
    }

    setLoading(true);
    await ideaService.createIdea({
      title: newIdea.title!,
      description: newIdea.description!,
      domain: newIdea.domain!,
      difficulty: newIdea.difficulty as string,
      price: Number(newIdea.price),
      visible: !!newIdea.visible,
      media: Array.isArray(newIdea.media) ? newIdea.media : [],
      createdBy: profile.uid,
    }, newContent);
    
    setNewIdea({ title: '', description: '', domain: '', difficulty: 'Beginner', price: 0, visible: false, media: [] });
    setNewContent({ implementationSteps: '', resources: '' });
    await fetchIdeas();
    setLoading(false);
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    await ideaService.toggleVisibility(id, !current);
    await fetchIdeas();
  };

  const handleConfirmPurchase = async (p: Purchase) => {
    if (confirm(`Confirm purchase for ${p.userId}?`)) {
      setLoading(true);
      await ideaService.confirmPurchase(p.id, p.ideaId);
      await fetchPurchases();
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project forever?')) {
      await ideaService.deleteIdea(id);
      await fetchIdeas();
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase italic text-white mb-2">Access Restrained</h1>
          <p className="text-neutral-500">Only high-level Forge Admins can access this terminal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">Command Center</h1>
          <p className="text-brand-yellow font-mono text-xs uppercase tracking-widest mt-2">Forge Administration Terminal v4.0</p>
        </div>
        <div className="flex bg-neutral-900 border border-neutral-800 rounded-2xl p-1 shadow-inner">
          <div className="px-4 py-2 text-center border-r border-neutral-800">
            <div className="text-lg font-black text-white italic leading-none">{ideas.length}</div>
            <div className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold mt-1">Total Ideas</div>
          </div>
          <div className="px-4 py-2 text-center">
            <div className="text-lg font-black text-brand-yellow italic leading-none">{purchases.filter(p => p.status === 'pending').length}</div>
            <div className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold mt-1">Pending Orders</div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <section className="lg:col-span-1">
          <form onSubmit={handleCreate} className="bg-neutral-800/20 border border-neutral-800 rounded-3xl p-8 space-y-6 sticky top-24">
            <h2 className="text-xl font-black uppercase italic text-white flex items-center">
              <PlusCircle className="w-5 h-5 mr-3 text-brand-yellow" /> Forge New Project
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Project Title *</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={e => setNewIdea({...newIdea, title: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-yellow outline-none transition-colors"
                  placeholder="e.g. AI-Powered CRM"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Domain *</label>
                  <input
                    type="text"
                    value={newIdea.domain}
                    onChange={e => setNewIdea({...newIdea, domain: e.target.value})}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-yellow outline-none transition-colors"
                    placeholder="Web Dev"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Difficulty</label>
                  <select
                    value={newIdea.difficulty}
                    onChange={e => setNewIdea({...newIdea, difficulty: e.target.value as any})}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-yellow outline-none transition-colors appearance-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Price (INR ₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={newIdea.price}
                    onChange={e => setNewIdea({...newIdea, price: Number(e.target.value)})}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:border-brand-yellow outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Media URLs (Comma separated)</label>
                <textarea
                  value={newIdea.media?.join(', ')}
                  onChange={e => setNewIdea({...newIdea, media: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-yellow outline-none transition-colors h-20"
                  placeholder="https://youtube.com/..., https://image.png"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1.5 block">Tutorial (Markdown)</label>
                <textarea
                  value={newContent.implementationSteps}
                  onChange={e => setNewContent({...newContent, implementationSteps: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-yellow outline-none transition-colors h-32"
                  placeholder="# Phase 1..."
                />
              </div>

              <div className="flex items-center space-x-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 group cursor-pointer" onClick={() => setNewIdea({...newIdea, visible: !newIdea.visible})}>
                <div className={`w-10 h-5 rounded-full transition-colors relative ${newIdea.visible ? 'bg-brand-yellow' : 'bg-neutral-800'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-neutral-900 transition-all ${newIdea.visible ? 'left-6' : 'left-1'}`} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white italic">Publish Immediately</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-yellow hover:bg-yellow-500 text-neutral-900 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Ignite Creation</span>}
              </button>
            </div>
          </form>
        </section>

        <section className="lg:col-span-2 space-y-12">
          {/* Pending Orders Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight italic text-white flex items-center">
              <ShoppingBag className="w-6 h-6 mr-3 text-brand-yellow" /> Pending Orders
              <span className="ml-4 px-2 py-0.5 bg-neutral-800 text-neutral-500 rounded text-xs font-mono">{purchases.filter(p => p.status === 'pending').length}</span>
            </h2>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
              {purchases.filter(p => p.status === 'pending').length === 0 ? (
                <div className="p-12 text-center text-neutral-600 font-bold uppercase tracking-widest text-sm">No pending forge requests.</div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {purchases.filter(p => p.status === 'pending').map(p => (
                    <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/[0.02] transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-brand-yellow font-black italic tracking-tight">{p.ideaTitle}</span>
                          <span className="text-[10px] text-neutral-600 font-mono italic">#{p.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-xs text-neutral-400 font-medium">User UID: <span className="font-mono text-neutral-500">{p.userId}</span></div>
                        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{formatINR(p.priceAtPurchase || 0)} • {toDate(p.createdAt).toLocaleDateString()}</div>
                      </div>
                      <button
                        onClick={() => handleConfirmPurchase(p)}
                        className="bg-brand-yellow text-neutral-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-yellow/10"
                      >
                        Confirm Payment
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Ideas Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight italic text-white flex items-center">
              <Database className="w-6 h-6 mr-3 text-brand-yellow" /> Forge Repository
              <span className="ml-4 px-2 py-0.5 bg-neutral-800 text-neutral-500 rounded text-xs font-mono">{ideas.length}</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 group hover:border-brand-yellow/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{idea.domain || 'Uncategorized'}</span>
                    <button
                      onClick={() => handleToggleVisibility(idea.id, !!idea.visible)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                        idea.visible 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {idea.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{idea.visible ? 'Online' : 'Offline'}</span>
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-black uppercase italic text-white mb-6 group-hover:text-brand-yellow transition-colors leading-tight">{idea.title}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-brand-yellow font-black text-lg italic tracking-tighter">{formatINR(idea.price)}</div>
                    <div className="flex items-center space-x-2">
                       <button
                        onClick={() => handleDelete(idea.id)}
                        className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
