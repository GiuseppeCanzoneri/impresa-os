import { AlertTriangle } from 'lucide-react';

export default function ConfigurationError() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-950 p-6 text-white">
      <div className="max-w-xl rounded-3xl border border-red-500/30 bg-white p-8 text-slate-950 shadow-2xl">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Configurazione Supabase mancante</h1>
        <p className="mt-3 text-slate-600">
          L'app non può avviarsi in modalità protetta perché mancano le variabili ambiente Supabase.
          In produzione l'accesso demo è disabilitato per sicurezza.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
{`VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...`}
        </pre>
        <p className="mt-4 text-sm text-slate-500">
          Crea il file <strong>.env.local</strong> nella root del progetto oppure configura le stesse variabili su Vercel/Dyad.
        </p>
      </div>
    </div>
  );
}
