import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';

interface AuthRequiredProps {
  children: React.ReactNode;
}

export function AuthRequired({ children }: AuthRequiredProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
}