import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, Search, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MOCK_SAFETY = [
  { id: '1', type: 'POS', title: 'Piano Operativo Sicurezza - Monza', expiry: '2024-12-31', status: 'valid' },
  { id: '2', type: 'DURC', title: 'DURC Impresa Rossi Srl', expiry: '2024-06-15', status: 'expiring' },
  { id: '3', type: 'Attestato', title: 'Corso Sicurezza - Mario Bianchi', expiry: '2024-05-01', status: 'expired' },
];

const Safety = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sicurezza</h1>
          <p className="text-slate-500">Monitora scadenze documenti, POS, DURC e attestati.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} /> Carica Documento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="text-rose-600" size={32} />
            <div>
              <p className="text-sm font-medium text-rose-700">Documenti Scaduti</p>
              <h3 className="text-2xl font-bold text-rose-900">3</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 flex items-center gap-4">
            <Calendar className="text-amber-600" size={32} />
            <div>
              <p className="text-sm font-medium text-amber-700">In Scadenza (30gg)</p>
              <h3 className="text-2xl font-bold text-amber-900">5</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6 flex items-center gap-4">
            <ShieldCheck className="text-emerald-600" size={32} />
            <div>
              <p className="text-sm font-medium text-emerald-700">Conformità Totale</p>
              <h3 className="text-2xl font-bold text-emerald-900">92%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {MOCK_SAFETY.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  doc.status === 'valid' && "bg-emerald-100 text-emerald-600",
                  doc.status === 'expiring' && "bg-amber-100 text-amber-600",
                  doc.status === 'expired' && "bg-rose-100 text-rose-600"
                )}>
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{doc.type}</Badge>
                    <h4 className="font-bold text-slate-900">{doc.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Scadenza: {doc.expiry}</p>
                </div>
              </div>
              <Badge 
                className={cn(
                  "capitalize",
                  doc.status === 'valid' && "bg-emerald-500",
                  doc.status === 'expiring' && "bg-amber-500",
                  doc.status === 'expired' && "bg-rose-500"
                )}
              >
                {doc.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Safety;