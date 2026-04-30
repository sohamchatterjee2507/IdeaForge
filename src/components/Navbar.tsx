import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Lightbulb, User, LogOut, LayoutDashboard, Compass, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { profile, logout, signIn } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-brand-yellow rounded-lg">
                <Lightbulb className="w-6 h-6 text-neutral-900" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">IdeaForge</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
              <Link to="/explore" className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Explore</Link>
              {profile && (
                <>
                  <Link to="/my-ideas" className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">My Ideas</Link>
                  <Link to="/dashboard" className="text-neutral-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Dashboard</Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {profile ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium text-white">{profile.displayName}</span>
                  <span className="text-[10px] uppercase tracking-widest text-brand-yellow font-mono">{profile.role}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-full h-full p-1.5 text-neutral-400" />
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-brand-yellow hover:bg-yellow-500 text-neutral-900 px-4 py-2 rounded-lg text-sm font-bold transition-all glow-yellow"
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
