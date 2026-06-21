import React from 'react';
import { ClipboardList, CheckCircle2, Clock, Filter, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MOCK_REPORTS = [
  { id: '1', date: '2024-05-15', project: 'Cantiere Monza', workers: 5, hours: 40, status: 'verified', description: 'Gettata pilastri e posa ferro' },
  { id: '2', date: '2024-05-15', project: 'Via Roma', workers: 2, hours: 16, status: 'draft', description: 'Demolizione tramezzi interni' },
  { id: '3', date: '2024-05-14', project: 'Cantiere Monza', workers: 4, hours: 32, status: 'verified', description: 'Carpenteria piano 2' },
];

const Reports = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rapportini Giornalieri</h1>
          <p className="text-slate-500">Controlla le attività svolte e le ore lavorate in cantiere.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} /> Nuovo Rapportino
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Cerca per commessa o data..." className="pl-10 bg-white" />
          </div>
          <Button variant="outline" className="gap-2"><Filter size={18} /> Filtri</Button>
        </div>

        <div className="divide-y">
          {MOCK_REPORTS.map((r) => (
            <div key={r.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  r.status === 'verified' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                  <ClipboardList size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{r.project}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase">{r.date}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{r.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-medium">Operai</p>
                  <p className="font-bold">{r.workers}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-medium">Ore Totali</p>
                  <p className="font-bold">{r.hours}</p>
                </div>
                <Badge className={r.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}>
                  {r.status === 'verified' ? 'Verificato' : 'Bozza'}
                </Badge>
                <Button variant="ghost" size="sm">Dettagli</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;