import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, Filter, Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useCompany } from '@/hooks/useCompany';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { formatEuro, getProjectMargin, mockProjects } from '@/data/mockData';
import { isValidUuid } from '@/utils/uuid';
import type { Project } from '@/types';

const statusLabel: Record<Project['status'], string> = {
  planned: 'Pianificata',
  active: 'In corso',
  on_hold: 'Sospesa',
  completed: 'Completata',
  archived: 'Archiviata',
};

const statusClass: Record<Project['status'], string> = {
  planned: 'bg-slate-100 text-slate-800',
  active: 'bg-slate-950 text-white',
  on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function Projects() {
  const navigate = useNavigate();
  const { activeCompanyId, activeCompany, loading: companyLoading, error: companyError } = useCompany();
  const [projects, setProjects] = useState<Project[]>(isSupabaseConfigured ? [] : mockProjects);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      if (!isSupabaseConfigured) {
        setProjects(mockProjects);
        setError(null);
        return;
      }

      if (!supabase) {
        setProjects([]);
        setError('Supabase non configurato.');
        return;
      }

      if (!activeCompanyId) {
        setProjects([]);
        setError(null);
        return;
      }

      if (!isValidUuid(activeCompanyId)) {
        setProjects([]);
        setError(`ID azienda non valido: ${activeCompanyId}. Ricarica la pagina o cancella la cache del browser.`);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Errore caricamento commesse:', projectsError.message);
        setError(projectsError.message);
        setProjects([]);
      } else {
        setProjects((data ?? []) as Project[]);
      }

      setLoading(false);
    }

    loadProjects();
  }, [activeCompanyId]);

  const filteredProjects = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return projects;
    return projects.filter((project) => {
      return [project.name, project.client_name, project.location, project.code]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value));
    });
  }, [projects, search]);

  const activeProjects = projects.filter((project) => project.status === 'active').length;
  const totalContractAmount = projects.reduce((sum, project) => sum + Number(project.contract_amount ?? 0), 0);
  const totalCosts = projects.reduce((sum, project) => sum + Number(project.costs_to_date ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Commesse & Cantieri</h1>
          <p className="mt-1 text-slate-500">
            {activeCompany
              ? `Dati caricati per ${activeCompany.name}. Le commesse sono filtrate tramite company_id reale.`
              : companyLoading
                ? 'Caricamento azienda attiva...'
                : 'Nessuna azienda attiva disponibile.'}
          </p>
        </div>
        <Button className="bg-slate-950 hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" />
          Nuova commessa
        </Button>
      </div>

      {companyError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Errore caricamento azienda: {companyError}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Errore Supabase: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Commesse attive</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{activeProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Valore contratti</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{formatEuro(totalContractAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Costi registrati</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{formatEuro(totalCosts)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Cerca commesse, clienti, località..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtri
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commessa</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Contratto</TableHead>
                <TableHead>Costi</TableHead>
                <TableHead>Margine</TableHead>
                <TableHead>Avanzamento</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || companyLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Caricamento commesse...
                  </TableCell>
                </TableRow>
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    Nessuna commessa presente per questa azienda. Esegui il seed demo oppure crea una nuova commessa.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50">
                    <TableCell>
                      <button className="text-left" onClick={() => navigate(`/projects/${project.id}`)}>
                        <p className="font-semibold text-slate-950">{project.name}</p>
                        <p className="text-sm text-slate-500">
                          {project.code ?? 'Senza codice'} · {project.client_name} · {project.location ?? 'Sede non indicata'}
                        </p>
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusClass[project.status]}>{statusLabel[project.status]}</Badge>
                    </TableCell>
                    <TableCell>{formatEuro(Number(project.contract_amount ?? 0))}</TableCell>
                    <TableCell>{formatEuro(Number(project.costs_to_date ?? 0))}</TableCell>
                    <TableCell className="font-semibold">{getProjectMargin(project)}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={Number(project.progress ?? 0)} className="h-2 w-24" />
                        <span className="text-sm text-slate-500">{Number(project.progress ?? 0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {Number(project.alerts_count ?? 0) > 0 ? (
                          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {project.alerts_count}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> ok
                          </Badge>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${project.id}`)}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
