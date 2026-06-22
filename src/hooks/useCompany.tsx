import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { mockCompanies } from '@/data/mockData';
import { isValidUuid } from '@/utils/uuid';
import type { Company, CompanyMember, UserRole } from '@/types';

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

type CompanyRow = Company & {
  member_id?: string;
  profile_id?: string;
  role?: UserRole;
  is_active?: boolean;
};

function getStoredActiveCompanyId() {
  return localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
}

function saveActiveCompanyId(companyId: string | null) {
  if (!companyId) {
    localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY);
    return;
  }
  localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, companyId);
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(isSupabaseConfigured ? [] : mockCompanies);
  const [memberships, setMemberships] = useState<CompanyMember[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(() => {
    if (isSupabaseConfigured) return null;
    return getStoredActiveCompanyId() ?? mockCompanies[0]?.id ?? null;
  });
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  async function loadCompaniesWithRpc() {
    if (!supabase) return null;

    const { data, error: rpcError } = await supabase.rpc('get_my_companies');
    if (rpcError) return null;

    const rows = (data ?? []) as CompanyRow[];
    const nextCompanies: Company[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      vat_number: row.vat_number ?? null,
      fiscal_code: row.fiscal_code ?? null,
      logo_url: row.logo_url ?? null,
      plan: row.plan,
      status: row.status,
      settings: {},
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    const nextMemberships: CompanyMember[] = rows.map((row) => ({
      id: row.member_id ?? `${row.id}-${user?.id ?? 'me'}`,
      company_id: row.id,
      profile_id: row.profile_id ?? user?.id ?? '',
      role: row.role ?? 'operaio',
      is_active: row.is_active ?? true,
      created_at: row.created_at,
    }));

    return { nextCompanies, nextMemberships };
  }

  async function loadCompaniesWithJoin() {
    if (!supabase || !user) return { nextCompanies: [], nextMemberships: [] };

    const { data, error: membershipsError } = await supabase
      .from('company_members')
      .select('id, company_id, profile_id, role, is_active, created_at, company:companies(id, name, vat_number, fiscal_code, logo_url, plan, status, created_at, updated_at)')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (membershipsError) throw membershipsError;

    const nextMemberships = (data ?? []) as unknown as Array<CompanyMember & { company?: Company }>;
    const nextCompanies = nextMemberships
      .map((membership) => membership.company)
      .filter(Boolean) as Company[];

    return { nextCompanies, nextMemberships };
  }

  async function refreshCompanies() {
    if (!isSupabaseConfigured) {
      setCompanies(mockCompanies);
      const stored = getStoredActiveCompanyId();
      const nextId = stored ?? mockCompanies[0]?.id ?? null;
      setActiveCompanyIdState(nextId);
      setLoading(false);
      return;
    }

    if (!supabase || !user) {
      setCompanies([]);
      setMemberships([]);
      setActiveCompanyIdState(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loaded = (await loadCompaniesWithRpc()) ?? (await loadCompaniesWithJoin());
      const nextCompanies = loaded.nextCompanies.filter((company) => isValidUuid(company.id));
      const nextMemberships = loaded.nextMemberships.filter((membership) => isValidUuid(membership.company_id));

      setCompanies(nextCompanies);
      setMemberships(nextMemberships);

      const storedId = getStoredActiveCompanyId();
      const storedStillValid = Boolean(storedId && nextCompanies.some((company) => company.id === storedId));
      const firstCompanyId = nextCompanies[0]?.id ?? null;
      const nextActiveCompanyId = storedStillValid ? storedId : firstCompanyId;

      setActiveCompanyIdState(nextActiveCompanyId);
      saveActiveCompanyId(nextActiveCompanyId);
    } catch (err) {
      console.error('Errore caricamento aziende:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento aziende');
      setCompanies([]);
      setMemberships([]);
      setActiveCompanyIdState(null);
      saveActiveCompanyId(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function setActiveCompanyId(companyId: string) {
    if (isSupabaseConfigured && !isValidUuid(companyId)) {
      console.warn('ID azienda non valido ignorato:', companyId);
      return;
    }
    setActiveCompanyIdState(companyId);
    saveActiveCompanyId(companyId);
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
