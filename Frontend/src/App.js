import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LegalCityAuth from './LegalCityAuth';
import AdminDashboard from './pages/admin/AdminDashboard';
import GoogleUserSetup from './pages/auth/GoogleUserSetup';
import GoogleLawyerSetup from './pages/auth/GoogleLawyerSetup';
import LawyerDirectory from './pages/public/LawyerDirectory';
import LawyerProfile from './pages/lawyer/LawyerProfile';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import UserDashboard from './pages/userdashboard/UserDashboard';
import UserInterface from './pages/UserInterface';
import SharedLayout from './components/layout/SharedLayout';
import Blog from './pages/userdashboard/Blog';
import Messages from './pages/userdashboard/Messages';
import Directory from './pages/userdashboard/Directory';
import ChatPage from './pages/userdashboard/ChatPage';
import Forms from './pages/userdashboard/Forms';
import SocialMedia from './pages/userdashboard/SocialMedia';
import Tasks from './pages/userdashboard/Tasks';
import Cases from './pages/userdashboard/Cases';
import Dashboard from './pages/userdashboard/Dashboard';
import Accounting from './pages/userdashboard/Accounting';
import Profile from './pages/userdashboard/Profile';
import Calendar from './pages/userdashboard/Calendar';
import QA from './pages/userdashboard/QA';
import FindLawyer from './pages/userdashboard/FindLawyer';
import Refer from './pages/userdashboard/Refer';
import Settings from './pages/userdashboard/Settings';
import Logout from './pages/auth/Logout';

function App() {
  return (
    <div className="App">
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        duration={2000}
        toastOptions={{
          style: {
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      <Routes>
        {/* Home page - User Interface */}
        <Route path="/" element={<UserInterface />} />
        
        {/* Public Lawyer Directory */}
        <Route path="/lawyers" element={<LawyerDirectory />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<LegalCityAuth />} />
        <Route path="/register" element={<LegalCityAuth />} />
        <Route path="/forgot-password" element={<LegalCityAuth />} />
        <Route path="/reset-password" element={<LegalCityAuth />} />
        <Route path="/verify-email" element={<LegalCityAuth />} />
        
        {/* Lawyer Profile Page */}
        <Route path="/lawyer/:id" element={<LawyerProfile />} />
        
        {/* Lawyer Dashboard */}
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        
        {/* User Dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
        {/* Sidebar Pages with Shared Layout */}
        <Route element={<SharedLayout />}>
          <Route path="/blog" element={<Blog />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/social-media" element={<SocialMedia />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/find-lawyer" element={<FindLawyer />} />
          <Route path="/refer" element={<Refer />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Logout route - outside SharedLayout */}
        <Route path="/logout" element={<Logout />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Google OAuth Setup Pages */}
        <Route path="/google-user-setup" element={<GoogleUserSetup />} />
        <Route path="/google-lawyer-setup" element={<GoogleLawyerSetup />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
