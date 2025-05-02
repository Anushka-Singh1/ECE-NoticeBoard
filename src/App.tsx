import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NoticeProvider } from './contexts/NoticeContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { NoticeDetailPage } from './pages/NoticeDetailPage';
import { Navbar } from './components/layout/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NoticeProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Protected Admin Route */}
            <Route element={<ProtectedRoute requireAdmin={false} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="/notice/:id" element={<NoticeDetailPage />} />
          </Routes>
        </NoticeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;