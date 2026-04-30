import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen tech-grid">
      <Navbar />
      <main className="pt-16 pb-20">
        <Outlet />
      </main>
      
      <footer className="border-t border-neutral-800 bg-neutral-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-neutral-500 text-sm font-mono tracking-wider">
            &copy; 2026 IDEAFORGE // ENGINEERING THE FUTURE
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-neutral-600 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-brand-yellow transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-yellow transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-yellow transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
