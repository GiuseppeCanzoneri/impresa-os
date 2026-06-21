import React from 'react';
import { Truck, FileText, Search, Filter, Plus, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_DDT = [
  { id: '1', number: 'DDT 456/24', supplier: 'Edilizia Srl', project: 'Cantiere Monza', date: '2024-05-15', material: 'Cemento 32.5 R', status: 'linked' },
  { id: '2', number: 'DDT 789/24', supplier: 'Ferramenta Rossi', project: 'Via Roma', date: '2024-05-14', material: 'Viteria e tasselli', status: 'pending' },
  { id: '3', number: 'DDT 102/24', supplier: 'Siderurgica Srl', project: 'Cantiere Monza', date: '2024-05-12', material: 'Tondino ferro 12mm', status: 'pending' },
];

const DeliveryNotes = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bolle / DDT</h1>
          <p className="text-slate-500">Gestisci i documenti di trasporto e abbinali alle fatture.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} /> Carica DDT
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Cerca per numero o fornitore..." className="pl-10 bg-white" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numero</TableHead>
              <TableHead>Fornitore</TableHead>
              <TableHead>Commessa</TableHead>
              <TableHead>Materiale</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Stato Fattura</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_DDT.map((ddt) => (
              <TableRow key={ddt.id}>
                <TableCell className="font-medium">{ddt.number}</TableCell>
                <TableCell>{ddt.supplier}</TableCell>
                <TableCell>{ddt.project}</TableCell>
                <TableCell className="text-slate-500 text-sm">{ddt.material}</TableCell>
                <TableCell>{ddt.date}</TableCell>
                <TableCell>
                  <Badge variant={ddt.status === 'linked' ? 'default' : 'outline'} className={ddt.status === 'linked' ? 'bg-emerald-500' : ''}>
                    {ddt.status === 'linked' ? 'Abbinato' : 'Da Abbinare'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <LinkIcon size={18} />
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

export default DeliveryNotes;