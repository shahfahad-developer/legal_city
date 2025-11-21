import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import LegalCityAuth from './LegalCityAuth';
import AdminDashboard from './pages/admin/AdminDashboard';
import GoogleUserSetup from './pages/auth/GoogleUserSetup';
import GoogleLawyerSetup from './pages/auth/GoogleLawyerSetup';
import LawyerDirectory from './pages/public/LawyerDirectory';
import LawyerProfile from './pages/LawyerProfile';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import FindLawyer from './pages/FindLawyer';
import SearchResults from './pages/SearchResults';
import UserDashboard from './pages/userdashboard/UserDashboard';
import UserInterface from './pages/UserInterface';
import SharedLayout from './components/layout/SharedLayout';
import MainLayout from './components/layout/MainLayout';
import Blog from './pages/userdashboard/Blog';
import BlogPage from './pages/Blogs/blogs';
import BlogDetail from './pages/Blogs/BlogDetail';
import Messages from './pages/userdashboard/Messages';
import Directory from './pages/userdashboard/Directory';
import Forms from './pages/userdashboard/Forms';
import SocialMedia from './pages/userdashboard/SocialMedia';
import Tasks from './pages/userdashboard/Tasks';
import Cases from './pages/userdashboard/Cases';
import Dashboard from './pages/userdashboard/Dashboard';
import Accounting from './pages/userdashboard/Accounting';
import Profile from './pages/userdashboard/Profile';
import Calendar from './pages/userdashboard/Calendar';
import QA from './pages/userdashboard/QA';

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
        {/* Auth routes - No header/footer */}
        <Route path="/login" element={<LegalCityAuth />} />
        <Route path="/register" element={<LegalCityAuth />} />
        <Route path="/forgot-password" element={<LegalCityAuth />} />
        <Route path="/reset-password" element={<LegalCityAuth />} />
        <Route path="/verify-email" element={<LegalCityAuth />} />
        <Route path="/google-user-setup" element={<GoogleUserSetup />} />
        <Route path="/google-lawyer-setup" element={<GoogleLawyerSetup />} />
        <Route path="/logout" element={<Logout />} />
        

        
        {/* Dashboard routes - No header/footer */}
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/lawyers" element={<LawyerDirectory />} />
        <Route path="/dashboard/lawyer/:id" element={<LawyerProfile />} />
        <Route path="/dashboard/find-lawyer" element={<FindLawyer />} />
        
        {/* Sidebar Pages with Shared Layout - No header/footer */}
        <Route element={<SharedLayout />}>
          <Route path="/blog" element={<Blog />} />
          <Route path="/messages" element={<Messages />} />
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
          <Route path="/refer" element={<Refer />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Dashboard Blog Route - No header/footer when coming from dashboard */}
        <Route path="/dashboard-blogs" element={<BlogPage />} />
        
        {/* Admin Blog Route - No header/footer for admin */}
        <Route path="/admin-blogs" element={<BlogPage />} />
        
        {/* Public pages with Main Layout (Header + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<UserInterface />} />
          <Route path="/lawyers" element={<LawyerDirectory />} />
          <Route path="/find-lawyer" element={<FindLawyer />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Route>
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
