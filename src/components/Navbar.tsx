import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import { Lightbulb, User, LogOut, ShoppingCart, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { profile, logout, signIn } = useAuth();
  const { items } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-brand-yellow rounded-lg shadow-[0_0_10px_rgba(251,192,45,0.3)]">
                <Lightbulb className="w-6 h-6 text-neutral-900" />
              </div>
              <span className="text-xl font-black tracking-tight text-white uppercase italic">IdeaForge</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-6">
              <Link to="/explore" className="text-neutral-400 hover:text-brand-yellow px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors">Marketplace</Link>
              {profile && (
                <>
                  <Link to="/my-ideas" className="text-neutral-400 hover:text-brand-yellow px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors">My Forge</Link>
                  {profile.role === 'admin' && (
                    <Link to="/dashboard" className="text-neutral-400 hover:text-brand-yellow px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors flex items-center">
                      <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative group transition-transform active:scale-95">
              <ShoppingCart className="w-6 h-6 text-neutral-400 group-hover:text-brand-yellow transition-colors" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-neutral-900 text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-neutral-900 scale-110">
                  {items.length}
                </span>
              )}
            </Link>

            {profile ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-black text-white uppercase tracking-tighter">{profile.displayName}</span>
                  <span className="text-[10px] uppercase font-mono text-brand-yellow font-bold leading-none">{profile.role}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-neutral-800 bg-neutral-800 p-0.5 group hover:border-brand-yellow/50 transition-colors">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-full h-full p-1.5 text-neutral-500" />
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-brand-yellow hover:bg-yellow-500 text-neutral-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-yellow/10 active:scale-95 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
