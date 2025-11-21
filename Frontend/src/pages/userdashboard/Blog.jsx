<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard blogs page (no header/footer)
    navigate('/dashboard-blogs', { state: { from: 'user-dashboard' } });
  }, [navigate]);
  
  return (
    <div className="p-6">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to blogs...</p>
=======
import React from 'react';

const Blog = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Blog</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Welcome to the Blog page. Here you can read and write blog posts.</p>
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
      </div>
    </div>
  );
};

export default Blog;