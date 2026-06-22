import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCompany } from '@/hooks/useCompany';

export default function CompanySwitcher() {
  const { companies, activeCompany, activeCompanyId, setActiveCompanyId, loading } = useCompany();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 max-w-[260px] justify-between gap-2 bg-white">
          <span className="flex min-w-0 items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate font-medium">{loading ? 'Caricamento...' : activeCompany?.name ?? 'Nessuna azienda'}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Azienda attiva</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {companies.length === 0 ? (
          <DropdownMenuItem disabled>Nessuna azienda disponibile</DropdownMenuItem>
        ) : (
          companies.map((company) => (
            <DropdownMenuItem key={company.id} onClick={() => setActiveCompanyId(company.id)} className="flex items-center justify-between gap-3">
              <span className="min-w-0">
                <span className="block truncate font-medium">{company.name}</span>
                <span className="text-xs text-slate-500">Piano {company.plan}</span>
              </span>
              <span className="flex items-center gap-2">
                <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>{company.status}</Badge>
                {company.id === activeCompanyId ? <Check className="h-4 w-4 text-blue-600" /> : null}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
