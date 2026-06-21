import React from 'react';
import { Bell, Search, Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Topbar = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Cerca commesse, fatture, documenti..." 
            className="pl-10 bg-slate-50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
          <Building2 size={16} className="text-blue-600" />
          <span>Edilizia S.p.A.</span>
        </div>
        
        <Button variant="outline" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={18} />
          <span>Nuova Commessa</span>
        </Button>
      </div>
    </header>
  );
};

export default Topbar;