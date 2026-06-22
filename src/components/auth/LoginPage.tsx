import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Building2, Loader2, LockKeyhole, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-6 py-10 lg:px-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-bold">ImpresaOS</p>
              <p className="text-sm text-slate-400">AI Construction Operating System</p>
            </div>
          </div>

          <h1 className="max-w-xl text-4xl font-bold tracking-tight lg:text-5xl">
            Entra nella piattaforma operativa per impresa e cantiere.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Login, aziende, ruoli e dati sono ora predisposti per Supabase multi-tenant. L'app resta utilizzabile in demo se non configuri ancora le variabili ambiente.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-blue-300" /> Assistente AI pronto per dati reali</div>
            <div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-blue-300" /> Inbox cantiere pronta per WhatsApp Cloud API</div>
            <div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-blue-300" /> Aziende separate tramite company_id</div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md border-slate-800 bg-white text-slate-950 shadow-2xl">
            <CardHeader>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <LockKeyhole className="h-5 w-5 text-slate-700" />
              </div>
              <CardTitle>Accesso</CardTitle>
              <CardDescription>Usa l'utente creato in Supabase Authentication.</CardDescription>
            </CardHeader>
            <CardContent>
              {!isSupabaseConfigured && (
                <Alert className="mb-5 border-amber-200 bg-amber-50 text-amber-900">
                  <AlertTitle>Modalità demo</AlertTitle>
                  <AlertDescription>
                    Mancano VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. Puoi entrare nella demo tornando alla dashboard, ma per il database reale devi configurare .env.local.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-5 border-red-200 bg-red-50 text-red-900">
                  <AlertTitle>Errore login</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="gcanzoneri3@gmail.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading || !isSupabaseConfigured}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Accedi
                </Button>
              </form>

              {!isSupabaseConfigured && (
                <Button variant="outline" className="mt-3 w-full" onClick={() => navigate('/')}>
                  Entra in modalità demo
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
