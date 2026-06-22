import React from 'react';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, Building2, Shield, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCompany } from '@/hooks/useCompany';
import { usePermissions } from '@/hooks/usePermissions';

const Admin = () => {
  const { companies, loading: companiesLoading } = useCompany();
  const { loading: permissionsLoading, canViewAdmin, isSystemAdmin, role } = usePermissions();

  if (companiesLoading || permissionsLoading) {
    return <div className="p-6 text-slate-600">Caricamento permessi...</div>;
  }

  if (!canViewAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Amministrazione Sistema</h1>
        <p className="text-slate-500">
          Gestisci aziende, utenti e permessi multi-tenant. Accesso consentito solo ad amministratori autorizzati.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Ruolo corrente: {isSystemAdmin ? 'system admin' : role}</p>
            <p className="text-sm">
              Il ruolo <strong>super_admin</strong> non può essere assegnato da un company admin. La gestione degli amministratori
              di piattaforma avviene tramite tabella protetta <strong>system_admins</strong>.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="companies">Aziende</TabsTrigger>
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="roles">Ruoli & Permessi</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-slate-800">
            <Building2 className="h-5 w-5" />
            <h2 className="font-semibold">Aziende visibili</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Azienda</TableHead>
                <TableHead>Codice</TableHead>
                <TableHead>Piano</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.code ?? '-'}</TableCell>
                  <TableCell>{company.plan ?? '-'}</TableCell>
                  <TableCell>
                    <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                      {company.status ?? 'n/d'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="users" className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-slate-800">
            <Users className="h-5 w-5" />
            <h2 className="font-semibold">Utenti</h2>
          </div>
          <p className="text-sm text-slate-500">
            La gestione utenti completa verrà collegata nel prossimo step. Per ora la sezione è visibile solo agli admin autorizzati.
          </p>
        </TabsContent>

        <TabsContent value="roles" className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-slate-800">
            <Shield className="h-5 w-5" />
            <h2 className="font-semibold">Ruoli protetti</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {['company_admin', 'direzione', 'amministrazione', 'tecnico', 'capocantiere', 'operaio', 'consulente'].map((item) => (
              <div key={item} className="rounded-xl border p-3">
                <p className="font-medium text-slate-900">{item}</p>
                <p className="text-sm text-slate-500">Ruolo aziendale gestibile secondo policy RLS.</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
