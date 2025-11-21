import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Directory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the actual lawyer directory with state to indicate source
    navigate('/lawyers', { state: { from: 'dashboard' } });
  }, [navigate]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Redirecting to Lawyer Directory...</div>
      </div>
    </div>
  );
};

export default Directory;