import { Building2, ChevronsUpDown } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';

export default function CompanySwitcher() {
  const { companies, activeCompanyId, activeCompany, setActiveCompanyId, loading } = useCompany();

  if (loading) {
    return (
      <div className="hidden h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500 sm:flex">
        Caricamento...
      </div>
    );
  }

  if (companies.length <= 1) {
    return (
      <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 sm:flex">
        <Building2 className="h-4 w-4 text-slate-500" />
        <span className="max-w-[180px] truncate">{activeCompany?.name ?? 'Nessuna azienda'}</span>
      </div>
    );
  }

  return (
    <label className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 sm:flex">
      <Building2 className="h-4 w-4 text-slate-500" />
      <select
        className="max-w-[180px] bg-transparent outline-none"
        value={activeCompanyId ?? ''}
        onChange={(event) => setActiveCompanyId(event.target.value)}
        aria-label="Seleziona azienda"
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      <ChevronsUpDown className="h-4 w-4 text-slate-400" />
    </label>
  );
}
