import { Navigate } from 'react-router-dom';
import { Building2, ShieldCheck, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompany } from '@/hooks/useCompany';
import { usePermissions } from '@/hooks/usePermissions';

export default function Admin() {
  const { companies, memberships, activeCompany } = useCompany();
  const { canAccessAdmin } = usePermissions();

  if (!canAccessAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Aziende & Utenti</h1>
        <p className="mt-2 text-slate-500">Gestione multi-azienda, ruoli, permessi e moduli attivi.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aziende</CardTitle>
            <Building2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-slate-500">Aziende collegate al tuo profilo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberships.length}</div>
            <p className="text-xs text-slate-500">Ruoli attivi caricati da Supabase</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Azienda attiva</CardTitle>
            <ShieldCheck className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-2xl font-bold">{activeCompany?.name ?? '-'}</div>
            <p className="text-xs text-slate-500">Ambiente attualmente selezionato</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Elenco aziende</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <div className="font-semibold text-slate-950">{company.name}</div>
                <div className="text-sm text-slate-500">Codice: {company.code ?? '-'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{company.plan ?? 'base'}</Badge>
                <Badge>{company.status ?? 'active'}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
