import React from 'react';
import Login from '../../components/auth/Login';
import { useAuth } from '../../context/AuthContext';

/**
 * Login Page Component
 *
 * This page handles user and lawyer login authentication.
 * It supports login via email/password or registration ID for lawyers.
 * Provides options to switch to registration or forgot password flows.
 *
 * Features:
 * - User/Lawyer role selection
 * - Email or Registration ID login for lawyers
 * - Password visibility toggle
 * - Forgot password link
 * - Social login buttons (Google, Facebook) - placeholders for now
 * - Form validation and error handling
 * - Consistent styling with other auth pages
 */
const LoginPage = ({ onSwitchToRegister, onSwitchToForgot, onLoginSuccess }) => {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Render the Login component with props */}
      <Login
        onSwitchToRegister={onSwitchToRegister}
        onSwitchToForgot={onSwitchToForgot}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
};

export default LoginPage;