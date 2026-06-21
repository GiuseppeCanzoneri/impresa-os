import React from 'react';
import { Briefcase, Plus, Search, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MOCK_QUOTES = [
  { id: '1', client: 'Condominio Sole', title: 'Rifacimento Facciata', amount: 125000, margin: 25, status: 'sent', date: '2024-05-10' },
  { id: '2', client: 'Mario Rossi', title: 'Ristrutturazione Bagno', amount: 8500, margin: 30, status: 'accepted', date: '2024-05-08' },
  { id: '3', client: 'Azienda Alfa Srl', title: 'Impianto Fotovoltaico', amount: 45000, margin: 22, status: 'draft', date: '2024-05-12' },
];

const Quotes = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Preventivi</h1>
          <p className="text-slate-500">Crea computi metrici e gestisci le offerte commerciali.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} /> Nuovo Preventivo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_QUOTES.map((q) => (
          <Card key={q.id} className="hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{q.title}</h3>
                  <p className="text-sm text-slate-500">{q.client} • {q.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-medium">Importo</p>
                  <p className="font-bold">€ {q.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-medium">Margine Prev.</p>
                  <p className="font-bold text-emerald-600">{q.margin}%</p>
                </div>
                <Badge 
                  variant={q.status === 'accepted' ? 'default' : 'outline'}
                  className={cn(
                    "capitalize",
                    q.status === 'accepted' && "bg-emerald-500",
                    q.status === 'sent' && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                >
                  {q.status}
                </Badge>
                <Button variant="ghost" size="icon">
                  <ArrowRight size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quotes;