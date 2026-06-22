import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-xl border bg-white px-5 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Caricamento sessione...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
