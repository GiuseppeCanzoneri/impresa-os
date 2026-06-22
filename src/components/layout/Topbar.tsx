import React from 'react';
import { Bell, Building2, Menu, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur lg:ml-64 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu size={21} />
        </Button>

        <div className="relative hidden w-full max-w-xl md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Cerca commesse, fatture, documenti, messaggi..."
            className="border-slate-200 bg-slate-50 pl-10 focus-visible:ring-blue-500"
          />
        </div>

        <div className="md:hidden">
          <p className="text-sm font-semibold text-slate-900">ImpresaOS</p>
          <p className="text-xs text-slate-500">Erelma S.r.l.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 lg:flex">
          <Sparkles size={16} />
          <span>AI mock attiva</span>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 sm:flex">
          <Building2 size={16} className="text-blue-600" />
          <span>Erelma S.r.l.</span>
        </div>

        <Button variant="outline" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </Button>
      </div>
    </header>
  );
}
