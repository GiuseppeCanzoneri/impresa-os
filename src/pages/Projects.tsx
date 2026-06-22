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
import type { Project } from '@/types';

const statusLabel: Record<Project['status'], string> = {
  planned: 'Pianificata',
  active: 'In corso',
  on_hold: 'Sospesa',
  completed: 'Completata',
  archived: 'Archiviata',
};

export default function Projects() {
  const navigate = useNavigate();
  const { activeCompanyId, activeCompany } = useCompany();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      if (!supabase || !activeCompanyId) {
        setProjects(mockProjects);
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
        setProjects(mockProjects.filter((project) => project.company_id === activeCompanyId || !isSupabaseConfigured));
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Commesse & Cantieri</h1>
          <p className="mt-1 text-slate-600">
            Dati caricati per <strong>{activeCompany?.name ?? 'azienda demo'}</strong>. Le commesse sono filtrate tramite company_id.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuova commessa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Commesse attive</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{activeProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Valore contratti</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{formatEuro(totalContractAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Costi registrati</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{formatEuro(totalCosts)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Cerca per commessa, cliente, codice..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtri
          </Button>
        </div>

        {error && <div className="border-b border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Errore Supabase: {error}. Mostro i dati demo.</div>}

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-28 text-center">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Caricamento commesse...</span>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-28 text-center text-sm text-slate-500">Nessuna commessa presente per questa azienda.</TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                  <TableCell>
                    <div className="font-medium text-slate-950">{project.name}</div>
                    <div className="text-sm text-slate-500">{project.code ?? 'Senza codice'} · {project.client_name} · {project.location ?? 'Sede non indicata'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{statusLabel[project.status]}</Badge>
                  </TableCell>
                  <TableCell>{formatEuro(Number(project.contract_amount ?? 0))}</TableCell>
                  <TableCell>{formatEuro(Number(project.costs_to_date ?? 0))}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-950">{getProjectMargin(project)}%</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-[150px] items-center gap-3">
                      <Progress value={Number(project.progress ?? 0)} className="h-2" />
                      <span className="w-10 text-right text-sm text-slate-500">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      {project.alerts_count > 0 ? (
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                          <AlertTriangle className="mr-1 h-3 w-3" /> {project.alerts_count}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> ok
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
