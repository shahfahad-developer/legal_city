import React from 'react';
import AuthForm from '../../components/auth/AuthForm';

/**
 * Register Page Component
 *
 * This page handles user and lawyer registration.
 * It uses the AuthForm component to collect registration details
 * and provides options to switch to login or proceed with social registration.
 *
 * Features:
 * - User/Lawyer role selection
 * - Form validation for required fields
 * - Email verification flow after successful registration
 * - Social login buttons (Google, Facebook) - placeholders for now
 * - Consistent styling with other auth pages
 */
const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  return (
    <div className="w-full">
      {/* Logo Section - Consistent across all auth pages */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[#0284C7] rounded-full px-6 py-3 shadow-lg inline-flex">
            <span className="text-white font-bold text-3xl">Legal</span>
          </div>
          <span className="text-[#0284C7] font-bold text-3xl">City</span>
        </div>
        <p className="text-[#0284C7] text-sm font-semibold tracking-wider uppercase">
          " Legal for the people "
        </p>
      </div>

      {/* Render the AuthForm component with props */}
      <AuthForm
        onSwitchToLogin={onSwitchToLogin}
        onRegisterSuccess={onRegisterSuccess}
      />
    </div>
  );
};

export default Register;