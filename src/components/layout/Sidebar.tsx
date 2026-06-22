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
import { useCompany } from '@/hooks/useCompany';
import { useAuth } from '@/hooks/useAuth';

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

function initials(nameOrEmail: string) {
  const parts = nameOrEmail.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { roleLabel, canAccessAdmin } = usePermissions();
  const { activeCompany, profile } = useCompany();
  const { user } = useAuth();

  const visibleItems = menuItems.filter((item) => !item.adminOnly || canAccessAdmin);
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Utente';
  const displayInitials = initials(displayName);

  return (
    <aside className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex items-start justify-between border-b border-white/10 px-5 py-5">
        <div>
          <div className="text-xl font-bold leading-tight">ImpresaOS</div>
          <div className="text-sm text-slate-400">AI Construction OS</div>
        </div>
        {onClose ? (
          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-white/10 hover:text-white lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      <div className="border-b border-white/10 px-5 py-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Azienda attiva</div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="font-semibold">{activeCompany?.name ?? 'Nessuna azienda'}</div>
          <div className="mt-1 text-sm text-slate-400">
            {activeCompany ? `Piano ${activeCompany.plan ?? '—'} · ambiente protetto` : 'Seleziona o crea una azienda'}
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">{item.badge}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {displayInitials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">{displayName}</div>
            <div className="text-xs text-slate-400">{roleLabel}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      <div className="hidden h-screen w-72 shrink-0 lg:block">
        <SidebarContent />
      </div>

      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        <SheetContent side="left" className="w-72 border-r-0 bg-slate-950 p-0">
          <SidebarContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
