import { Navigate } from 'react-router-dom';
import { Building2, CheckCircle2, Lock, Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCompany } from '@/hooks/useCompany';
import { usePermissions } from '@/hooks/usePermissions';

function planLabel(plan?: string | null) {
  const labels: Record<string, string> = {
    free: 'Free',
    base: 'Base',
    professional: 'Professional',
    enterprise: 'Enterprise',
  };
  return plan ? labels[plan] ?? plan : '-';
}

function statusLabel(status?: string | null) {
  const labels: Record<string, string> = {
    active: 'Attiva',
    trial: 'Trial',
    suspended: 'Sospesa',
    archived: 'Archiviata',
  };
  return status ? labels[status] ?? status : '-';
}

function roleLabel(role?: string | null) {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    company_admin: 'Admin azienda',
    direzione: 'Direzione',
    amministrazione: 'Amministrazione',
    manager: 'Manager',
    tecnico: 'Tecnico',
    capocantiere: 'Capocantiere',
    operaio: 'Operaio',
    consulente: 'Consulente',
  };
  return role ? labels[role] ?? role : '-';
}

export default function Admin() {
  const { canAccessAdmin, roleLabel: currentRoleLabel } = usePermissions();
  const { companies, memberships, activeCompany } = useCompany();

  if (!canAccessAdmin) {
    return <Navigate to="/" replace />;
  }

  const activeMemberships = memberships.filter((membership) => membership.is_active);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
          <Shield className="h-4 w-4" />
          Area riservata · {currentRoleLabel}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Aziende & Utenti</h1>
        <p className="max-w-3xl text-slate-600">
          Gestione multi-azienda, ruoli e moduli attivi. I dati visualizzati sono filtrati tramite Supabase e RLS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Building2 className="h-4 w-4" /> Aziende accessibili
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{companies.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Users className="h-4 w-4" /> Membership attive
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{activeMemberships.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CheckCircle2 className="h-4 w-4" /> Azienda attiva
            </CardTitle>
          </CardHeader>
          <CardContent className="truncate text-lg font-semibold">{activeCompany?.name ?? 'Nessuna'}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aziende</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Azienda</TableHead>
                <TableHead>Piano</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>P. IVA / CF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500">
                    Nessuna azienda disponibile.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{planLabel(company.plan)}</TableCell>
                    <TableCell>
                      <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>{statusLabel(company.status)}</Badge>
                    </TableCell>
                    <TableCell>{company.vat_number ?? company.fiscal_code ?? '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ruoli utente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Azienda</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Profilo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMemberships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500">
                    Nessuna membership disponibile.
                  </TableCell>
                </TableRow>
              ) : (
                activeMemberships.map((membership) => {
                  const company = companies.find((item) => item.id === membership.company_id);
                  return (
                    <TableRow key={membership.id}>
                      <TableCell className="font-medium">{company?.name ?? membership.company_id}</TableCell>
                      <TableCell>{roleLabel(membership.role)}</TableCell>
                      <TableCell>
                        <Badge variant={membership.is_active ? 'default' : 'secondary'}>
                          {membership.is_active ? 'Attivo' : 'Disattivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{membership.profile_id}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-4 text-sm text-amber-900">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            Le modifiche vere a utenti, ruoli e abbonamenti verranno abilitate nello step successivo con funzioni RPC dedicate,
            così evitiamo escalation di privilegi dal frontend.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
