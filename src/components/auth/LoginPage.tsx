import { FormEvent, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LockKeyhole, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import ConfigurationError from '@/components/system/ConfigurationError';

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSupabaseConfigured) return <ConfigurationError />;
  if (user) return <Navigate to={(location.state as any)?.from?.pathname ?? '/'} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) setError(signInError.message);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-950 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <LockKeyhole className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Accesso</h1>
        <p className="mt-2 text-slate-500">Usa l'utente creato in Supabase Authentication.</p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <div className="font-semibold">Errore login</div>
            <div className="mt-1 text-sm">{error}</div>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Email</span>
            <Input className="mt-2 h-11" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Password</span>
            <Input className="mt-2 h-11" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
        </div>

        <Button type="submit" className="mt-6 h-11 w-full bg-slate-950 hover:bg-slate-800" disabled={submitting || loading}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Accedi
        </Button>
      </form>
    </div>
  );
}
