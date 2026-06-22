import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { mockCompanies } from '@/data/mockData';
import type { Company, CompanyMember } from '@/types';

interface CompanyContextValue {
  companies: Company[];
  memberships: CompanyMember[];
  activeCompany: Company | null;
  activeCompanyId: string | null;
  loading: boolean;
  error: string | null;
  setActiveCompanyId: (companyId: string) => void;
  refreshCompanies: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);
const ACTIVE_COMPANY_STORAGE_KEY = 'impresaos_active_company_id';

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(isSupabaseConfigured ? [] : mockCompanies);
  const [memberships, setMemberships] = useState<CompanyMember[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY) ?? mockCompanies[0]?.id ?? null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshCompanies() {
    if (!supabase || !user) {
      setCompanies(mockCompanies);
      setActiveCompanyIdState((current) => current ?? mockCompanies[0]?.id ?? null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: membershipsError } = await supabase
        .from('company_members')
        .select('id, company_id, profile_id, role, is_active, created_at, company:companies(*)')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (membershipsError) throw membershipsError;

      const nextMemberships = (data ?? []) as unknown as Array<CompanyMember & { company?: Company }>;
      const nextCompanies = nextMemberships
        .map((membership) => membership.company)
        .filter(Boolean) as Company[];

      setMemberships(nextMemberships);
      setCompanies(nextCompanies);

      const storedId = localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
      const storedStillValid = storedId && nextCompanies.some((company) => company.id === storedId);
      const firstCompanyId = nextCompanies[0]?.id ?? null;

      setActiveCompanyIdState(storedStillValid ? storedId : firstCompanyId);
      if (!storedStillValid && firstCompanyId) {
        localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, firstCompanyId);
      }
    } catch (err) {
      console.error('Errore caricamento aziende:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento aziende');
      setCompanies(mockCompanies);
      setActiveCompanyIdState(mockCompanies[0]?.id ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function setActiveCompanyId(companyId: string) {
    setActiveCompanyIdState(companyId);
    localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, companyId);
  }

  const activeCompany = companies.find((company) => company.id === activeCompanyId) ?? companies[0] ?? null;

  const value = useMemo(
    () => ({
      companies,
      memberships,
      activeCompany,
      activeCompanyId: activeCompany?.id ?? null,
      loading,
      error,
      setActiveCompanyId,
      refreshCompanies,
    }),
    [companies, memberships, activeCompany, loading, error]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany deve essere usato dentro CompanyProvider');
  return context;
}
