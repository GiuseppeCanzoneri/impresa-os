import React from 'react';
import { ShoppingCart, Users, Package, Search, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

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
        <TabsList>
          <TabsTrigger value="ordini" className="gap-2"><ShoppingCart size={16} /> Ordini</TabsTrigger>
          <TabsTrigger value="fornitori" className="gap-2"><Users size={16} /> Fornitori</TabsTrigger>
          <TabsTrigger value="materiali" className="gap-2"><Package size={16} /> Materiali</TabsTrigger>
        </TabsList>

        <TabsContent value="ordini" className="mt-6">
          <div className="bg-white rounded-xl border p-12 text-center text-slate-400">
            <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
            <p>Elenco ordini di acquisto in fase di caricamento...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Procurement;