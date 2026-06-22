import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Loader2, Plus, Search, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useCompany } from '@/hooks/useCompany';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mockCompanies } from '@/data/mockData';
import type { Company, CompanyMember } from '@/types';

const roleDescriptions = [
  { role: 'super_admin', description: 'Accesso totale a tutte le aziende e impostazioni di sistema.' },
  { role: 'company_admin', description: 'Gestione completa della propria azienda e utenti.' },
  { role: 'direzione', description: 'Accesso a dashboard finanziarie e reportistica avanzata.' },
  { role: 'amministrazione', description: 'Fatture, fornitori, pagamenti e scadenze.' },
  { role: 'tecnico', description: 'Gestione cantieri, rapportini e documenti tecnici.' },
  { role: 'capocantiere', description: 'Inserimento rapportini, foto, DDT e note di cantiere.' },
  { role: 'operaio', description: 'Accesso operativo limitato a presenza, note e allegati.' },
  { role: 'consulente', description: 'Accesso esterno limitato a pratiche o documenti assegnati.' },
];

export default function Admin() {
  const { activeCompany, refreshCompanies } = useCompany();
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      if (!supabase) {
        setCompanies(mockCompanies);
        return;
      }

      setLoading(true);
      setError(null);

      const [companiesResult, membersResult] = await Promise.all([
        supabase.from('companies').select('*').order('created_at', { ascending: false }),
        supabase.from('company_members').select('id, company_id, profile_id, role, is_active, created_at').order('created_at', { ascending: false }),
      ]);

      if (companiesResult.error) {
        console.error(companiesResult.error.message);
        setError(companiesResult.error.message);
        setCompanies(mockCompanies);
      } else {
        setCompanies((companiesResult.data ?? []) as Company[]);
      }

      if (membersResult.error) {
        console.error(membersResult.error.message);
      } else {
        setMembers((membersResult.data ?? []) as CompanyMember[]);
      }

      setLoading(false);
    }

    loadAdminData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Aziende & Utenti</h1>
          <p className="mt-1 text-slate-600">
            Pannello multi-azienda. Azienda attiva: <strong>{activeCompany?.name ?? 'demo'}</strong>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshCompanies}>Aggiorna</Button>
          <Button><Plus className="mr-2 h-4 w-4" /> Nuova azienda</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Building2 className="h-9 w-9 text-blue-600" />
            <div><p className="text-sm text-slate-500">Aziende</p><p className="text-2xl font-bold">{companies.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Users className="h-9 w-9 text-blue-600" />
            <div><p className="text-sm text-slate-500">Membri</p><p className="text-2xl font-bold">{members.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Shield className="h-9 w-9 text-blue-600" />
            <div><p className="text-sm text-slate-500">Ruoli</p><p className="text-2xl font-bold">{roleDescriptions.length}</p></div>
          </CardContent>
        </Card>
      </div>

      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Errore Supabase: {error}. Mostro i dati demo.</div>}
      {!isSupabaseConfigured && <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">Supabase non configurato: questa è ancora modalità demo.</div>}

      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="companies">Aziende</TabsTrigger>
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="roles">Ruoli & Permessi</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b p-4">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="Cerca azienda..." />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Azienda</TableHead>
                <TableHead>P. IVA</TableHead>
                <TableHead>Piano</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Creata il</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow>
              ) : companies.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500">Nessuna azienda presente.</TableCell></TableRow>
              ) : companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.vat_number ?? '-'}</TableCell>
                  <TableCell><Badge variant="secondary">{company.plan}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                      {company.status === 'active' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : null}
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(company.created_at).toLocaleDateString('it-IT')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="users" className="rounded-2xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile ID</TableHead>
                <TableHead>Azienda</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="h-24 text-center text-sm text-slate-500">Nessun membro visibile. Verifica RLS o login super_admin.</TableCell></TableRow>
              ) : members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono text-xs">{member.profile_id}</TableCell>
                  <TableCell className="font-mono text-xs">{member.company_id}</TableCell>
                  <TableCell><Badge variant="outline">{member.role}</Badge></TableCell>
                  <TableCell>{member.is_active ? 'Attivo' : 'Disattivo'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="roles" className="rounded-2xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ruolo</TableHead>
                <TableHead>Descrizione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleDescriptions.map((role) => (
                <TableRow key={role.role}>
                  <TableCell><Badge variant="outline">{role.role}</Badge></TableCell>
                  <TableCell>{role.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
