import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
<<<<<<< HEAD

=======
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
import LegalCityAuth from './LegalCityAuth';
import AdminDashboard from './pages/admin/AdminDashboard';
import GoogleUserSetup from './pages/auth/GoogleUserSetup';
import GoogleLawyerSetup from './pages/auth/GoogleLawyerSetup';
import LawyerDirectory from './pages/public/LawyerDirectory';
<<<<<<< HEAD
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
=======
import LawyerProfile from './pages/lawyer/LawyerProfile';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import UserDashboard from './pages/userdashboard/UserDashboard';
import UserInterface from './pages/UserInterface';
import SharedLayout from './components/layout/SharedLayout';
import Blog from './pages/userdashboard/Blog';
import Messages from './pages/userdashboard/Messages';
import Directory from './pages/userdashboard/Directory';
import ChatPage from './pages/userdashboard/ChatPage';
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
import Forms from './pages/userdashboard/Forms';
import SocialMedia from './pages/userdashboard/SocialMedia';
import Tasks from './pages/userdashboard/Tasks';
import Cases from './pages/userdashboard/Cases';
import Dashboard from './pages/userdashboard/Dashboard';
import Accounting from './pages/userdashboard/Accounting';
import Profile from './pages/userdashboard/Profile';
import Calendar from './pages/userdashboard/Calendar';
import QA from './pages/userdashboard/QA';
<<<<<<< HEAD

=======
import FindLawyer from './pages/userdashboard/FindLawyer';
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
import Refer from './pages/userdashboard/Refer';
import Settings from './pages/userdashboard/Settings';
import Logout from './pages/auth/Logout';

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
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
=======
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
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
        <Route path="/login" element={<LegalCityAuth />} />
        <Route path="/register" element={<LegalCityAuth />} />
        <Route path="/forgot-password" element={<LegalCityAuth />} />
        <Route path="/reset-password" element={<LegalCityAuth />} />
        <Route path="/verify-email" element={<LegalCityAuth />} />
<<<<<<< HEAD
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
=======
        
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
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
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
<<<<<<< HEAD
=======
          <Route path="/find-lawyer" element={<FindLawyer />} />
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
          <Route path="/refer" element={<Refer />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
<<<<<<< HEAD
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
=======
        {/* Logout route - outside SharedLayout */}
        <Route path="/logout" element={<Logout />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Google OAuth Setup Pages */}
        <Route path="/google-user-setup" element={<GoogleUserSetup />} />
        <Route path="/google-lawyer-setup" element={<GoogleLawyerSetup />} />
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
