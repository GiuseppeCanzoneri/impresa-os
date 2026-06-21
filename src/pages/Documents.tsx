import React from 'react';
import { FileStack, Search, Plus, Folder, File, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Documents = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documenti</h1>
          <p className="text-slate-500">Archivio centralizzato di tutti i file aziendali e di cantiere.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} /> Carica File
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {['Commesse', 'Fatture', 'Personale', 'Mezzi', 'Sicurezza', 'Archivio'].map((folder) => (
          <Card key={folder} className="hover:bg-slate-50 cursor-pointer transition-colors">
            <CardContent className="p-6 text-center">
              <Folder className="mx-auto text-blue-500 mb-2" size={32} />
              <p className="text-sm font-medium text-slate-700">{folder}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Cerca file..." className="pl-10" />
          </div>
        </div>
        <div className="p-12 text-center text-slate-400">
          <FileStack size={48} className="mx-auto mb-4 opacity-20" />
          <p>Seleziona una cartella per visualizzare i file.</p>
        </div>
      </div>
    </div>
  );
};

export default Documents;