import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import { Lightbulb, User, ShoppingCart, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { profile, logout, signIn } = useAuth();
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('magiktrove@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <div className="relative">
                {/* Profile Trigger button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-3 hover:opacity-90 transition-opacity focus:outline-none"
                >
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-black text-white uppercase tracking-tighter">{profile.displayName}</span>
                    <span className="text-[10px] uppercase font-mono text-brand-yellow font-bold leading-none">{profile.role}</span>
                  </div>
                  <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-neutral-800 bg-neutral-800 p-0.5 group hover:border-brand-yellow/50 transition-colors">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-full h-full p-1.5 text-neutral-500" />
                    )}
                  </div>
                </button>

                {/* Invisible dropdown closer overlay */}
                {isOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                  />
                )}

                {/* Dropdown Menu Panel */}
                {isOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 z-50 space-y-4">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-4 pb-3 border-b border-neutral-800/60">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-brand-yellow bg-neutral-800 p-0.5">
                        {profile.photoURL ? (
                          <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-full h-full p-1.5 text-neutral-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black text-white truncate uppercase tracking-tight">{profile.displayName}</h4>
                        <p className="text-xs text-neutral-500 truncate font-mono">{profile.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-brand-yellow/10 text-brand-yellow text-[9px] font-black uppercase tracking-widest rounded-md border border-brand-yellow/20 font-mono">
                          {profile.role}
                        </span>
                      </div>
                    </div>

                    {/* Navigation/Helper section */}
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setIsGuideOpen(true);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-neutral-300 hover:text-brand-yellow hover:bg-neutral-800/45 transition-colors text-xs font-bold uppercase tracking-wider text-left group"
                      >
                        <span className="flex items-center">
                          <span className="mr-3 text-sm">📖</span>
                          How Purchasing Works
                        </span>
                        <span className="text-neutral-600 group-hover:text-brand-yellow transition-colors font-mono">&rarr;</span>
                      </button>

                      {/* Contact Support Frame */}
                      <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/50 space-y-2">
                        <div className="flex items-center text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                          <span className="mr-2 text-xs">✉</span> Contact Support
                        </div>
                        <div className="flex items-center justify-between mt-1 gap-2">
                          <a
                            href="mailto:magiktrove@gmail.com"
                            className="text-xs text-brand-yellow font-semibold truncate hover:underline hover:text-yellow-400"
                          >
                            magiktrove@gmail.com
                          </a>
                          <button
                            onClick={handleCopyEmail}
                            className="p-1 px-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-md text-[9px] font-bold text-neutral-400 hover:text-white transition-all uppercase tracking-wider"
                          >
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Exit trigger action */}
                    <div className="pt-3 border-t border-neutral-800/60">
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-xs font-bold uppercase tracking-wider text-left"
                      >
                        <span className="mr-3 text-sm">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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

      {/* Guide modal to display purchase cycle */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsGuideOpen(false)}
          />
          <div className="relative bg-neutral-900 border border-neutral-800 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-base font-black uppercase italic text-white flex items-center">
                <span className="text-base mr-2">📖</span> HOW PURCHASING WORKS
              </h3>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors font-mono text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {[
                "Browse the Marketplace and select a blueprint.",
                "Add the blueprint to your cart.",
                "Complete checkout to generate a Reference ID.",
                "Contact magiktrove@gmail.com and provide your Reference ID.",
                "Payment instructions will be provided manually.",
                "After payment verification, an admin confirms the purchase.",
                "The blueprint is automatically unlocked in your Vault."
              ].map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow font-bold font-mono text-xs flex items-center justify-center mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-neutral-300 text-xs sm:text-sm font-medium leading-relaxed">
                    {index === 3 ? (
                      <>
                        Contact <a href="mailto:magiktrove@gmail.com" className="text-brand-yellow underline hover:text-yellow-400">magiktrove@gmail.com</a> and provide your Reference ID.
                      </>
                    ) : step}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-full py-3 bg-brand-yellow hover:bg-yellow-500 text-neutral-900 uppercase font-black tracking-widest text-xs transition-all active:scale-95 rounded-xl shadow-lg shadow-brand-yellow/10"
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
