import React from 'react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  ClipboardList,
  FileStack,
  HardHat,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCompany } from '@/hooks/useCompany';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MessageSquare, label: 'Assistente AI', path: '/ai-assistant', badge: 'AI' },
  { icon: Inbox, label: 'Inbox Cantiere', path: '/inbox', badge: '3' },
  { icon: HardHat, label: 'Commesse', path: '/projects' },
  { icon: Receipt, label: 'Fatture', path: '/invoices', badge: '2' },
  { icon: TrendingUp, label: 'Cash Flow', path: '/cash-flow' },
  { icon: ClipboardList, label: 'Rapportini', path: '/reports' },
  { icon: Truck, label: 'Bolle / DDT', path: '/delivery-notes' },
  { icon: Briefcase, label: 'Preventivi', path: '/quotes' },
  { icon: ShoppingCart, label: 'Procurement', path: '/procurement' },
  { icon: ShieldCheck, label: 'Sicurezza', path: '/safety', badge: '!' },
  { icon: FileStack, label: 'Documenti', path: '/documents' },
  { icon: Users, label: 'Aziende & Utenti', path: '/admin' },
  { icon: Settings, label: 'Impostazioni', path: '/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { activeCompany } = useCompany();

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">ImpresaOS</h1>
          <p className="text-xs text-slate-400">AI Construction OS</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="border-b border-slate-800 px-5 py-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Azienda attiva</p>
        <p className="mt-1 truncate text-sm font-semibold">{activeCompany?.name ?? 'Nessuna azienda'}</p>
        <p className="text-xs text-slate-400">Piano {activeCompany?.plan ?? 'demo'}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/30' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <Badge className="ml-auto bg-white/10 text-white hover:bg-white/10" variant="secondary">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">GC</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Giuseppe Canzoneri</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <SidebarContent />
      </aside>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <SidebarContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
