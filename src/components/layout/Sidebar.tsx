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
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string;
  adminOnly?: boolean;
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
  { icon: Users, label: 'Aziende & Utenti', path: '/admin', adminOnly: true },
  { icon: Settings, label: 'Impostazioni', path: '/settings', adminOnly: true },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { roleLabel, canAccessAdmin } = usePermissions();
  const visibleItems = menuItems.filter((item) => !item.adminOnly || canAccessAdmin);

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <div>
          <div className="text-lg font-bold leading-none">ImpresaOS</div>
          <div className="mt-1 text-xs text-slate-400">AI Construction OS</div>
        </div>
        {onClose ? (
          <Button type="button" variant="ghost" size="icon" className="text-slate-300 hover:bg-white/10 hover:text-white lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      <div className="border-b border-white/10 px-5 py-4">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Azienda attiva</div>
        <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-sm font-semibold">Erelma S.r.l.</div>
          <div className="mt-1 text-xs text-slate-400">Piano Enterprise · ambiente protetto</div>
        </div>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">{item.badge}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">GC</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Giuseppe Canzoneri</div>
            <div className="truncate text-xs text-slate-400">{roleLabel}</div>
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
        <SheetContent side="left" className="w-72 border-0 bg-slate-950 p-0 text-white">
          <SidebarContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
