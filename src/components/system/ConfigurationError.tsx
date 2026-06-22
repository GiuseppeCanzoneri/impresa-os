import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfigurationError() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full rounded-2xl border border-red-200 bg-white p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-red-50 p-3 text-red-700">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Configurazione Supabase mancante</h1>
            <p className="mt-2 text-slate-600">
              L'app non può avviarsi in modalità protetta perché mancano le variabili ambiente Supabase.
              In produzione l'accesso demo è disabilitato per sicurezza.
            </p>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 font-mono text-sm text-slate-800">
              <div>VITE_SUPABASE_URL=https://xxxxx.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=eyJ...</div>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Crea il file <strong>.env.local</strong> nella root del progetto oppure configura le stesse variabili su Vercel/Dyad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
