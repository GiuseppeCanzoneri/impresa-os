import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
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

const MOCK_INVOICES = [
  { id: '1', type: 'passive', number: 'FPR 12/2024', entity: 'Forniture Edili Srl', amount: 12450.00, date: '2024-05-10', status: 'pending', project: 'Cantiere Monza' },
  { id: '2', type: 'active', number: 'FAT 45/2024', entity: 'Immobiliare Nord', amount: 45000.00, date: '2024-05-01', status: 'paid', project: 'Cantiere Monza' },
  { id: '3', type: 'passive', number: 'FPR 88/2024', entity: 'Noleggi Professionali', amount: 3200.00, date: '2024-05-12', status: 'approved', project: 'Via Roma' },
  { id: '4', type: 'passive', number: 'FPR 05/2024', entity: 'Studio Tecnico Verdi', amount: 1500.00, date: '2024-05-15', status: 'rejected', project: 'Cantiere Monza' },
];

const Invoices = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fatture</h1>
          <p className="text-slate-500">Gestisci il ciclo attivo e passivo della tua azienda.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">Esporta XML</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus size={18} /> Nuova Fattura
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-emerald-700">Totale Attivo (Mese)</p>
            <h3 className="text-2xl font-bold text-emerald-900 mt-1">€ 124.500</h3>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-100">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-rose-700">Totale Passivo (Mese)</p>
            <h3 className="text-2xl font-bold text-rose-900 mt-1">€ 82.300</h3>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-blue-700">Da Approvare</p>
            <h3 className="text-2xl font-bold text-blue-900 mt-1">8 Fatture</h3>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Cerca per numero o fornitore..." className="pl-10 bg-white" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Tutte</Button>
            <Button variant="outline" size="sm">Attive</Button>
            <Button variant="outline" size="sm">Passive</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Numero</TableHead>
              <TableHead>Cliente/Fornitore</TableHead>
              <TableHead>Commessa</TableHead>
              <TableHead>Importo</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_INVOICES.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>
                  {inv.type === 'active' ? (
                    <ArrowUpRight className="text-emerald-500" size={18} />
                  ) : (
                    <ArrowDownLeft className="text-rose-500" size={18} />
                  )}
                </TableCell>
                <TableCell className="font-medium">{inv.number}</TableCell>
                <TableCell>{inv.entity}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">{inv.project}</Badge>
                </TableCell>
                <TableCell className="font-semibold">€ {inv.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "capitalize",
                      inv.status === 'paid' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      inv.status === 'pending' && "bg-amber-50 text-amber-700 border-amber-200",
                      inv.status === 'rejected' && "bg-rose-50 text-rose-700 border-rose-200",
                      inv.status === 'approved' && "bg-blue-50 text-blue-700 border-blue-200"
                    )}
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={18} />
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

export default Invoices;