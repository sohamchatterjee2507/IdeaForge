import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import IdeaDetail from './pages/IdeaDetail';
import Dashboard from './pages/Dashboard';
import MyIdeas from './pages/MyIdeas';
import CartPage from './pages/CartPage';
import { AuthProvider } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-brand-yellow selection:text-neutral-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/idea/:id" element={<IdeaDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-ideas" element={<MyIdeas />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
