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
      </div>
    </div>
  );
};

export default Blog;