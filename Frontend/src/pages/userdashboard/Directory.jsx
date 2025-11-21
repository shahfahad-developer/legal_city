<<<<<<< HEAD
import React from 'react';

const Directory = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Directory</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Welcome to the Directory page. Here you can browse lawyer directories.</p>
=======
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
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
      </div>
    </div>
  );
};

export default Directory;