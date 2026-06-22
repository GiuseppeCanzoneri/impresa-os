import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import ConfigurationError from '@/components/system/ConfigurationError';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Sicurezza: niente bypass demo quando Supabase non è configurato.
  // Se mancano le env, l'app si blocca invece di aprire le rotte private.
  if (!isSupabaseConfigured) {
    return <ConfigurationError />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-slate-300">Verifica sessione...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
