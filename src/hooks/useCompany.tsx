import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, requireSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

type CompanySummary = {
  id: string;
  name: string;
  code?: string | null;
  vat_number?: string | null;
  status?: string | null;
  plan?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  role?: string | null;
  is_system_admin?: boolean;
};

type CompanyContextValue = {
  companies: CompanySummary[];
  activeCompanyId: string | null;
  activeCompany: CompanySummary | null;
  loading: boolean;
  error: string | null;
  setActiveCompanyId: (companyId: string) => void;
  refreshCompanies: () => Promise<void>;
};

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setActiveCompanyId = (companyId: string) => {
    setActiveCompanyIdState(companyId);
    localStorage.setItem('impresaos_active_company_id', companyId);
  };

  const refreshCompanies = async () => {
    if (!isSupabaseConfigured || !user) {
      setCompanies([]);
      setActiveCompanyIdState(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const supabase = requireSupabase();

      // Non usare select('*') su companies: questa RPC esclude settings/segreti.
      const { data, error: rpcError } = await supabase.rpc('get_my_companies');
      if (rpcError) throw rpcError;

      const nextCompanies = (data ?? []) as CompanySummary[];
      setCompanies(nextCompanies);

      const savedCompanyId = localStorage.getItem('impresaos_active_company_id');
      const savedStillValid = savedCompanyId && nextCompanies.some((company) => company.id === savedCompanyId);
      const nextActiveId = savedStillValid ? savedCompanyId : nextCompanies[0]?.id ?? null;
      setActiveCompanyIdState(nextActiveId);
      if (nextActiveId) localStorage.setItem('impresaos_active_company_id', nextActiveId);
    } catch (err) {
      console.error('Errore caricamento aziende:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento aziende');
      setCompanies([]);
      setActiveCompanyIdState(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const activeCompany = useMemo(
    () => companies.find((company) => company.id === activeCompanyId) ?? null,
    [companies, activeCompanyId]
  );

  const value = useMemo<CompanyContextValue>(
    () => ({
      companies,
      activeCompanyId,
      activeCompany,
      loading,
      error,
      setActiveCompanyId,
      refreshCompanies,
    }),
    [companies, activeCompanyId, activeCompany, loading, error]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany deve essere usato dentro CompanyProvider');
  }
  return context;
}
