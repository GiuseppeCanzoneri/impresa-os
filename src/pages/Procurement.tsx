import React from 'react';
import { ShoppingCart, Users, Package, Search, Plus, MoreVertical, Star, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const MOCK_SUPPLIERS = [
  { id: '1', name: 'Edilizia Srl', category: 'Materiali Edili', contact: 'Luca Rossi', phone: '+39 333 1234567', rating: 4.8 },
  { id: '2', name: 'Siderurgica Srl', category: 'Ferro e Acciaio', contact: 'Marco Verdi', phone: '+39 334 7654321', rating: 4.5 },
  { id: '3', name: 'Elettrica Pro', category: 'Impianti', contact: 'Anna Neri', phone: '+39 335 9876543', rating: 4.9 },
];

const MOCK_MATERIALS = [
  { id: '1', name: 'Cemento 32.5 R', unit: 'Sacco 25kg', stock: 120, price: 6.50, category: 'Leganti' },
  { id: '2', name: 'Tondino Ferro 12mm', unit: 'Barra 6m', stock: 450, price: 12.80, category: 'Ferro' },
  { id: '3', name: 'Laterizio Forato 8x25x25', unit: 'Pezzo', stock: 1200, price: 0.85, category: 'Laterizi' },
];

const Procurement = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Procurement</h1>
          <p className="text-slate-500">Gestisci fornitori, ordini e materiali.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} /> Nuovo Ordine
        </Button>
      </div>

      <Tabs defaultValue="ordini">
        <TabsList className="bg-white border">
          <TabsTrigger value="ordini" className="gap-2"><ShoppingCart size={16} /> Ordini</TabsTrigger>
          <TabsTrigger value="fornitori" className="gap-2"><Users size={16} /> Fornitori</TabsTrigger>
          <TabsTrigger value="materiali" className="gap-2"><Package size={16} /> Materiali</TabsTrigger>
        </TabsList>

        <TabsContent value="ordini" className="mt-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Ordine</TableHead>
                  <TableHead>Fornitore</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Importo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#ORD-2024-001</TableCell>
                  <TableCell>Edilizia Srl</TableCell>
                  <TableCell>15/05/2024</TableCell>
                  <TableCell>€ 4.250,00</TableCell>
                  <TableCell><Badge className="bg-blue-500">Inviato</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon"><MoreVertical size={18} /></Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="fornitori" className="mt-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornitore</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contatto</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SUPPLIERS.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><Badge variant="secondary">{s.category}</Badge></TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{s.contact}</p>
                        <p className="text-slate-500 text-xs">{s.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{s.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon"><Phone size={16} /></Button>
                        <Button variant="ghost" size="icon"><Mail size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="materiali" className="mt-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Materiale</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unità</TableHead>
                  <TableHead>Giacenza</TableHead>
                  <TableHead>Prezzo Unit.</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MATERIALS.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.category}</TableCell>
                    <TableCell className="text-slate-500">{m.unit}</TableCell>
                    <TableCell>
                      <span className={m.stock < 200 ? 'text-rose-600 font-bold' : 'font-medium'}>
                        {m.stock}
                      </span>
                    </TableCell>
                    <TableCell>€ {m.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Plus size={18} /></Button></TableCell>
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

export default Procurement;