import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { ThemeProvider } from './context/ThemeContext';
import { Sesion, getSesion } from './utils/auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';
import ToastContainer from './components/ToastContainer';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import SkillsPage from './pages/SkillsPage';
import KanbanPage from './pages/KanbanPage';
import TerminalPage from './pages/TerminalPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import MisContenidoPage from './pages/MisContenidoPage';
import MessagesPage from './pages/admin/MessagesPage';
import ContentPage from './pages/admin/ContentPage';
import CVPage from './pages/admin/CVPage';
import UsersPage from './pages/admin/UsersPage';

function Layout({ sesion }: { sesion: Sesion | null }) {
  const location = useLocation();
  return (
    <div className="layout">
      <Sidebar sesion={sesion} />
      <div className="main-area">
        <Header sesion={sesion} />
        <div className="content">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [sesion, setSesion] = useState<Sesion | null>(getSesion());

  useEffect(() => {
    const handleSesionChange = () => setSesion(getSesion());
    window.addEventListener('token-changed', handleSesionChange);
    window.addEventListener('storage', handleSesionChange);
    return () => {
      window.removeEventListener('token-changed', handleSesionChange);
      window.removeEventListener('storage', handleSesionChange);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route element={<Layout sesion={sesion} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin/mensajes" element={<AdminRoute><MessagesPage /></AdminRoute>} />
        <Route path="/admin/contenido" element={<AdminRoute><ContentPage /></AdminRoute>} />
        <Route path="/admin/cv" element={<AdminRoute><CVPage /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><UsersPage /></AdminRoute>} />
        <Route path="/mis-contenido" element={<ProtectedRoute><MisContenidoPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <ScrollToTop />
          <ToastContainer />
          <AppContent />
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
