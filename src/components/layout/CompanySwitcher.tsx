import { Building2, ChevronDown } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { cn } from '@/lib/utils';

export default function CompanySwitcher() {
  const { companies, activeCompany, activeCompanyId, setActiveCompanyId, loading, isDemoFallback } = useCompany();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <Building2 className="h-4 w-4 text-slate-500" />
      <select
        value={activeCompanyId ?? ''}
        disabled={loading || companies.length === 0}
        onChange={(event) => setActiveCompanyId(event.target.value)}
        className="min-w-[150px] bg-transparent text-sm font-semibold text-slate-900 outline-none disabled:text-slate-400"
      >
        {companies.length === 0 ? (
          <option value="">Nessuna azienda</option>
        ) : (
          companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))
        )}
      </select>
      <ChevronDown className="h-4 w-4 text-slate-400" />
      {isDemoFallback ? (
        <span className="hidden rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 md:inline-flex">
          Demo
        </span>
      ) : null}
      <span className={cn('sr-only')}>{activeCompany?.name ?? 'Nessuna azienda'}</span>
    </div>
  );
}
