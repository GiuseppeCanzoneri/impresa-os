import React from 'react';
import { Users, Building2, Shield, Plus, Search, MoreVertical } from 'lucide-react';
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

const Admin = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Amministrazione Sistema</h1>
        <p className="text-slate-500">Gestisci aziende, utenti e permessi multi-tenant.</p>
      </div>

      <Tabs defaultValue="utenti">
        <TabsList>
          <TabsTrigger value="aziende" className="gap-2"><Building2 size={16} /> Aziende</TabsTrigger>
          <TabsTrigger value="utenti" className="gap-2"><Users size={16} /> Utenti</TabsTrigger>
          <TabsTrigger value="ruoli" className="gap-2"><Shield size={16} /> Ruoli & Permessi</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default Admin;