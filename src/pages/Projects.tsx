import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Cantiere Monza - Residenziale',
    client: 'Immobiliare Nord',
    status: 'active',
    budget: 450000,
    costs: 125000,
    margin: 22,
    progress: 35,
    manager: 'Ing. Rossi',
    alerts: 2
  },
  {
    id: '2',
    name: 'Ristrutturazione Via Roma',
    client: 'Condominio Roma 12',
    status: 'active',
    budget: 85000,
    costs: 72000,
    margin: 15,
    progress: 85,
    manager: 'Arch. Bianchi',
    alerts: 0
  },
  {
    id: '3',
    name: 'Impianto Fotovoltaico ESCO',
    client: 'Green Energy Srl',
    status: 'planned',
    budget: 120000,
    costs: 0,
    margin: 28,
    progress: 0,
    manager: 'Ing. Verdi',
    alerts: 0
  }
];

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Commesse & Cantieri</h1>
          <p className="text-slate-500">Monitora l'avanzamento e i margini di tutti i tuoi progetti.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter size={18} />
            Filtri
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Nuova Commessa</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Cerca commessa o cliente..." className="pl-10 bg-white" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[300px]">Commessa</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Costi</TableHead>
              <TableHead>Margine</TableHead>
              <TableHead>Avanzamento</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PROJECTS.map((p) => (
              <TableRow 
                key={p.id} 
                className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.client} • {p.manager}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={p.status === 'active' ? 'default' : 'secondary'} className={p.status === 'active' ? 'bg-emerald-500' : ''}>
                    {p.status === 'active' ? 'In Corso' : 'Pianificato'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">€ {p.budget.toLocaleString()}</TableCell>
                <TableCell className="text-slate-600">€ {p.costs.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={p.margin < 20 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}>
                    {p.margin}%
                  </span>
                </TableCell>
                <TableCell className="w-[200px]">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium text-slate-500">
                      <span>{p.progress}%</span>
                      {p.alerts > 0 && (
                        <span className="flex items-center gap-1 text-rose-500">
                          <AlertTriangle size={10} /> {p.alerts} alert
                        </span>
                      )}
                    </div>
                    <Progress value={p.progress} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <ArrowRight size={18} className="text-slate-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Projects;