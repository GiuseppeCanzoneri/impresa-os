import React from 'react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  MessageSquare,
  Inbox,
  HardHat,
  Receipt,
  TrendingUp,
  ClipboardList,
  Truck,
  ShieldCheck,
  Users,
  Settings,
  Briefcase,
  FileStack,
  ShoppingCart,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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
  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex items-start justify-between border-b border-slate-800 p-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">ImpresaOS</h1>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            AI Construction OS
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="text-slate-300 lg:hidden" onClick={onClose}>
            <X size={18} />
          </Button>
        )}
      </div>

      <div className="border-b border-slate-800 p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <p className="text-xs uppercase tracking-wider text-slate-400">Azienda attiva</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">Erelma S.r.l.</p>
          <p className="mt-1 text-xs text-slate-400">Piano Enterprise · ambiente demo</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              )
            }
          >
            <item.icon size={18} />
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold">
            GC
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Giuseppe Canzoneri</p>
            <p className="truncate text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 lg:block">
        <SidebarContent />
      </aside>

      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        <SheetContent side="left" className="w-72 border-0 bg-slate-950 p-0 text-white">
          <SidebarContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
