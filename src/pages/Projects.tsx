import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Loader2, Plus, Search } from 'lucide-react';
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

const statusLabel: Record<string, string> = {
  planned: 'Pianificata',
  active: 'In corso',
  on_hold: 'Sospesa',
  completed: 'Completata',
  archived: 'Archiviata',
};

const statusClass: Record<string, string> = {
  planned: 'bg-slate-100 text-slate-800',
  active: 'bg-slate-950 text-white',
  on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-50 text-slate-500 border-slate-200',
};

function normalizeProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    company_id: String(row.company_id),
    code: String(row.code ?? ''),
    name: String(row.name ?? ''),
    client_name: String(row.client_name ?? ''),
    location: row.location ? String(row.location) : null,
    status: String(row.status ?? 'planned') as Project['status'],
    contract_amount: Number(row.contract_amount ?? 0),
    costs_to_date: Number(row.costs_to_date ?? 0),
    revenues_to_date: Number(row.revenues_to_date ?? 0),
    margin_estimated: Number(row.margin_estimated ?? 0),
    progress: Number(row.progress ?? 0),
    manager_id: row.manager_id ? String(row.manager_id) : null,
    start_date: row.start_date ? String(row.start_date) : null,
    end_date: row.end_date ? String(row.end_date) : null,
    alerts_count: Number(row.alerts_count ?? 0),
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  };
}

export default function Projects() {
  const navigate = useNavigate();
  const { activeCompanyId, activeCompany, loading: companyLoading, error: companyError, isDemoFallback } = useCompany();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const shouldUseDemo = !isSupabaseConfigured || isDemoFallback || !activeCompanyId || !isValidUuid(activeCompanyId);

      if (shouldUseDemo) {
        setProjects(mockProjects);
        setError(null);
        setLoading(false);
        return;
      }

      if (!supabase) {
        setProjects(mockProjects);
        setError(null);
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
        setProjects(mockProjects);
        setError('Dati demo attivi: impossibile leggere le commesse reali.');
      } else {
        const nextProjects = (data ?? []).map((row) => normalizeProject(row as Record<string, unknown>));
        setProjects(nextProjects.length > 0 ? nextProjects : mockProjects);
      }

      setLoading(false);
    }

    loadProjects();
  }, [activeCompanyId, isDemoFallback]);

  const filteredProjects = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return projects;

    return projects.filter((project) =>
      [project.name, project.code, project.client_name, project.location ?? ''].join(' ').toLowerCase().includes(value)
    );
  }, [projects, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Commesse / Cantieri</h1>
          <p className="mt-1 text-slate-500">
            {activeCompany ? `Gestione operativa per ${activeCompany.name}.` : 'Dati demo pronti per la presentazione.'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuova commessa
        </Button>
      </div>

      {(companyError || error || isDemoFallback) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {error ?? companyError ?? 'Modalità demo attiva per la presentazione.'}
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cerca per commessa, codice, cliente o località..."
          className="border-0 shadow-none focus-visible:ring-0"
        />
        {(loading || companyLoading) && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Commessa</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Contratto</TableHead>
                <TableHead>Costi</TableHead>
                <TableHead>Margine</TableHead>
                <TableHead>Avanzamento</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-slate-50/80">
                  <TableCell>
                    <div className="font-semibold text-slate-950">{project.name}</div>
                    <div className="text-sm text-slate-500">
                      {project.code} · {project.client_name} · {project.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusClass[project.status] ?? statusClass.planned}>
                      {statusLabel[project.status] ?? project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatEuro(project.contract_amount)}</TableCell>
                  <TableCell>{formatEuro(project.costs_to_date)}</TableCell>
                  <TableCell className="font-semibold">{getProjectMargin(project)}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress} className="h-2 w-32" />
                      <span className="text-sm font-medium text-slate-500">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.alerts_count ? (
                      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {project.alerts_count}
                      </Badge>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                      Apri
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
