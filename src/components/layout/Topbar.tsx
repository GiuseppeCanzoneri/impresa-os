import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CompanySwitcher from '@/components/layout/CompanySwitcher';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-6 lg:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Apri menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 flex-1 md:block">
        <div className="relative max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-10 rounded-xl border-slate-200 pl-9"
            placeholder="Cerca commesse, fatture, DDT, messaggi..."
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <CompanySwitcher />
        <Button type="button" variant="ghost" size="icon" className="relative" aria-label="Notifiche">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={signOut} aria-label="Esci">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
