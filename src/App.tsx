/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import IdeaDetail from './pages/IdeaDetail';
import Dashboard from './pages/Dashboard';
import MyIdeas from './pages/MyIdeas';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'admin' | 'student' }) {
  const { profile, loading } = useAuth();

  if (loading) return null;
  if (!profile) return <Navigate to="/" />;
  if (role && profile.role !== role && profile.role !== 'admin') return <Navigate to="/" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="idea/:id" element={<IdeaDetail />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-ideas" 
              element={
                <ProtectedRoute>
                  <MyIdeas />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
