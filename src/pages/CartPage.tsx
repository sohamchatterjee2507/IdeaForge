import { motion } from 'motion/react';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { ideaService } from '../lib/ideaService';
import { Trash2, CreditCard, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../lib/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();
  const { profile, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!profile) {
      signIn();
      return;
    }

    setLoading(true);
    try {
      // Create pending purchases for all items
      for (const item of items) {
        await ideaService.createPurchase(profile.uid, item);
      }
      clearCart();
      setCompleted(profile.uid.slice(0, 8).toUpperCase());
    } catch (error) {
      console.error(error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-12 rounded-3xl bg-neutral-800/20 border border-brand-yellow/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
            <CheckCircle2 className="w-16 h-16 text-brand-yellow mx-auto mb-6" />
            <h1 className="text-3xl font-black uppercase italic text-white mb-4">Request Sent!</h1>
            <p className="text-neutral-400 mb-8 font-medium">
              Your purchase request has been logged. To complete the transaction:
            </p>
            
            <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-700/50 mb-8 text-left space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-brand-yellow/10 rounded-lg">
                  <Mail className="w-4 h-4 text-brand-yellow" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Contact Email</div>
                  <div className="text-white font-mono break-all italic">magiktrove@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-brand-yellow/10 rounded-lg">
                  <CreditCard className="w-4 h-4 text-brand-yellow" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Reference ID</div>
                  <div className="text-brand-yellow font-mono font-black italic">{completed}</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
              Once we verify your payment via email, your projects will be instantly unlocked in your "My Forge" section.
            </p>

            <Link to="/my-ideas" className="inline-flex items-center space-x-2 text-brand-yellow font-black uppercase text-xs tracking-widest hover:translate-x-2 transition-transform">
              <span>View Pending Purchases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-8 italic flex items-center">
          Your Forge Cart <div className="ml-4 h-1 flex-1 bg-neutral-800 rounded-full" />
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-neutral-800/10 rounded-3xl border-2 border-dashed border-neutral-800">
            <p className="text-neutral-500 font-bold uppercase tracking-widest mb-6">Your cart is echoing... it's empty.</p>
            <Link to="/explore" className="bg-brand-yellow text-neutral-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform inline-block">
              Browse Ideas
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center p-4 bg-neutral-800/20 rounded-2xl border border-neutral-800/50 group">
                  <div className="flex-1">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-1">{item.title}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{item.domain}</span>
                      <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                      <span className="text-brand-yellow font-black italic">{formatINR(item.price)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-neutral-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-neutral-800/30 rounded-3xl p-6 border border-neutral-700/30 sticky top-24">
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-6 italic">Checkout Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span className="font-bold uppercase tracking-widest">Subtotal</span>
                    <span>{formatINR(total)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span className="font-bold uppercase tracking-widest">Tax (incl.)</span>
                    <span>₹0</span>
                  </div>
                  <div className="h-px bg-neutral-700/50" />
                  <div className="flex justify-between">
                    <span className="font-black uppercase tracking-widest text-white">Total</span>
                    <span className="text-brand-yellow font-black text-2xl tracking-tighter italic">{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-brand-yellow hover:bg-yellow-500 text-neutral-900 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span>Secure Checkout</span>
                      <CreditCard className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="mt-6 text-[10px] text-neutral-500 text-center uppercase font-bold tracking-widest leading-relaxed">
                  Upon clicking checkout, we will record your request and provide payment instructions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
