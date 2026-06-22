import React from 'react';
import { Users, Building2, Shield, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_COMPANIES = [
  { id: '1', name: 'Edilizia S.p.A.', vat: 'IT01234567890', plan: 'Enterprise', status: 'active', users: 24 },
  { id: '2', name: 'Restauri Rossi Srl', vat: 'IT09876543210', plan: 'Professional', status: 'active', users: 8 },
  { id: '3', name: 'Impianti Verdi Snc', vat: 'IT11223344556', plan: 'Basic', status: 'suspended', users: 3 },
];

const MOCK_ROLES = [
  { id: '1', name: 'Super Admin', description: 'Accesso totale a tutte le aziende e impostazioni di sistema.', users: 2 },
  { id: '2', name: 'Company Admin', description: 'Gestione completa della propria azienda e utenti.', users: 12 },
  { id: '3', name: 'Direzione', description: 'Accesso a dashboard finanziarie e reportistica avanzata.', users: 5 },
  { id: '4', name: 'Tecnico', description: 'Gestione cantieri, rapportini e documenti tecnici.', users: 45 },
];

const Admin = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Amministrazione Sistema</h1>
        <p className="text-slate-500">Gestisci aziende, utenti e permessi multi-tenant.</p>
      </div>

      <Tabs defaultValue="aziende">
        <TabsList className="bg-white border">
          <TabsTrigger value="aziende" className="gap-2"><Building2 size={16} /> Aziende</TabsTrigger>
          <TabsTrigger value="utenti" className="gap-2"><Users size={16} /> Utenti</TabsTrigger>
          <TabsTrigger value="ruoli" className="gap-2"><Shield size={16} /> Ruoli & Permessi</TabsTrigger>
        </TabsList>

        <TabsContent value="aziende" className="mt-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Azienda</TableHead>
                  <TableHead>P. IVA</TableHead>
                  <TableHead>Piano</TableHead>
                  <TableHead>Utenti</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_COMPANIES.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">{c.vat}</TableCell>
                    <TableCell><Badge variant="outline">{c.plan}</Badge></TableCell>
                    <TableCell>{c.users}</TableCell>
                    <TableCell>
                      <Badge className={c.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}>
                        {c.status === 'active' ? 'Attiva' : 'Sospesa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon"><MoreVertical size={18} /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="utenti" className="mt-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utente</TableHead>
                  <TableHead>Azienda</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">MR</div>
                      <div>
                        <p className="font-medium">Mario Rossi</p>
                        <p className="text-xs text-slate-500">mario@edilizia.it</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Edilizia S.p.A.</TableCell>
                  <TableCell><Badge variant="secondary">Company Admin</Badge></TableCell>
                  <TableCell><Badge className="bg-emerald-500">Attivo</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreVertical size={18} /></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ruoli" className="mt-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Utenti Assegnati</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ROLES.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-bold text-blue-600">{r.name}</TableCell>
                    <TableCell className="max-w-md text-sm text-slate-500">{r.description}</TableCell>
                    <TableCell className="font-medium">{r.users}</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Shield size={18} /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;