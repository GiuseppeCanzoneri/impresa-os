import { Menu, Bell, LogOut, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CompanySwitcher from '@/components/layout/CompanySwitcher';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden flex-1 items-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Cerca commesse, fatture, DDT, messaggi..." />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!isSupabaseConfigured && (
            <Badge variant="outline" className="hidden border-amber-300 bg-amber-50 text-amber-700 sm:inline-flex">
              <ShieldAlert className="mr-1 h-3.5 w-3.5" /> Demo senza Supabase
            </Badge>
          )}
          <CompanySwitcher />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          {isSupabaseConfigured && user && (
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Esci">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
