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
import { useCompany } from '@/hooks/useCompany';
import { usePermissions } from '@/hooks/usePermissions';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string;
  adminOnly?: boolean;
  financialOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MessageSquare, label: 'Assistente AI', path: '/ai-assistant', badge: 'AI' },
  { icon: Inbox, label: 'Inbox Cantiere', path: '/inbox', badge: '3' },
  { icon: HardHat, label: 'Commesse', path: '/projects' },
  { icon: Receipt, label: 'Fatture', path: '/invoices', badge: '2', financialOnly: true },
  { icon: TrendingUp, label: 'Cash Flow', path: '/cash-flow', financialOnly: true },
  { icon: ClipboardList, label: 'Rapportini', path: '/reports' },
  { icon: Truck, label: 'Bolle / DDT', path: '/delivery-notes' },
  { icon: Briefcase, label: 'Preventivi', path: '/quotes', financialOnly: true },
  { icon: ShoppingCart, label: 'Procurement', path: '/procurement', financialOnly: true },
  { icon: ShieldCheck, label: 'Sicurezza', path: '/safety', badge: '!' },
  { icon: FileStack, label: 'Documenti', path: '/documents' },
  { icon: Users, label: 'Aziende & Utenti', path: '/admin', adminOnly: true },
  { icon: Settings, label: 'Impostazioni', path: '/settings', adminOnly: true },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { activeCompany } = useCompany();
  const { canViewAdmin, canViewFinancials, role } = usePermissions();

  const visibleItems = menuItems.filter((item) => {
    if (item.adminOnly && !canViewAdmin) return false;
    if (item.financialOnly && !canViewFinancials) return false;
    return true;
  });

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">ImpresaOS</h1>
          <p className="text-xs text-slate-400">AI Construction OS</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-300 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-500">Azienda attiva</p>
        <p className="mt-1 truncate text-sm font-semibold text-white">{activeCompany?.name ?? 'Nessuna azienda'}</p>
        <p className="text-xs text-slate-400">Ruolo: {role ?? 'non assegnato'}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden h-screen w-72 shrink-0 lg:block">
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
