import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Inbox, 
  HardHat, 
  FileText, 
  TrendingUp, 
  ClipboardList, 
  Truck, 
  ShieldCheck, 
  Users, 
  Settings,
  Briefcase,
  FileStack,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MessageSquare, label: 'Assistente AI', path: '/ai-assistant' },
  { icon: Inbox, label: 'Inbox Cantiere', path: '/inbox' },
  { icon: HardHat, label: 'Commesse', path: '/projects' },
  { icon: FileText, label: 'Fatture', path: '/invoices' },
  { icon: TrendingUp, label: 'Cash Flow', path: '/cash-flow' },
  { icon: ClipboardList, label: 'Rapportini', path: '/reports' },
  { icon: Truck, label: 'Bolle / DDT', path: '/delivery-notes' },
  { icon: Briefcase, label: 'Preventivi', path: '/quotes' },
  { icon: ShoppingCart, label: 'Procurement', path: '/procurement' },
  { icon: ShieldCheck, label: 'Sicurezza', path: '/safety' },
  { icon: FileStack, label: 'Documenti', path: '/documents' },
  { icon: Users, label: 'Aziende & Utenti', path: '/admin' },
  { icon: Settings, label: 'Impostazioni', path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">ImpresaOS</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">AI Operating System</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Mario Rossi</p>
            <p className="text-xs text-slate-400 truncate">Edilizia S.p.A.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;