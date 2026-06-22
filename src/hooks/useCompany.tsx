import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { mockCompanies } from '@/data/mockData';
import type { Company, CompanyMember, Profile, UserRole } from '@/types';

interface CompanyContextValue {
  companies: Company[];
  memberships: CompanyMember[];
  activeCompany: Company | null;
  activeCompanyId: string | null;
  activeRole: UserRole | null;
  isSystemAdmin: boolean;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  setActiveCompanyId: (companyId: string) => void;
  refreshCompanies: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);
const ACTIVE_COMPANY_STORAGE_KEY = 'impresaos_active_company_id';

interface MyCompanyRow {
  company_id: string;
  company_name: string;
  vat_number: string | null;
  fiscal_code: string | null;
  logo_url: string | null;
  plan: Company['plan'];
  status: Company['status'];
  role: UserRole;
  is_active: boolean;
  is_system_admin: boolean;
  created_at: string;
  updated_at: string;
}

function rowsToCompanies(rows: MyCompanyRow[]): Company[] {
  return rows.map((row) => ({
    id: row.company_id,
    name: row.company_name,
    vat_number: row.vat_number,
    fiscal_code: row.fiscal_code,
    logo_url: row.logo_url,
    plan: row.plan,
    status: row.status,
    settings: {},
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

function rowsToMemberships(rows: MyCompanyRow[], profileId: string): CompanyMember[] {
  return rows.map((row) => ({
    id: `${row.company_id}-${profileId}`,
    company_id: row.company_id,
    profile_id: profileId,
    role: row.role,
    is_active: row.is_active,
    created_at: row.created_at,
    company: {
      id: row.company_id,
      name: row.company_name,
      vat_number: row.vat_number,
      fiscal_code: row.fiscal_code,
      logo_url: row.logo_url,
      plan: row.plan,
      status: row.status,
      settings: {},
      created_at: row.created_at,
      updated_at: row.updated_at,
    },
  }));
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(isSupabaseConfigured ? [] : mockCompanies);
  const [memberships, setMemberships] = useState<CompanyMember[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(() =>
    localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshCompanies() {
    if (!supabase || !user) {
      setCompanies(mockCompanies);
      setMemberships([]);
      setIsSystemAdmin(false);
      setActiveCompanyIdState((current) => current ?? mockCompanies[0]?.id ?? null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, phone, default_company_id, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile((profileData as Profile | null) ?? null);

      const { data, error: rpcError } = await supabase.rpc('get_my_companies');
      if (rpcError) throw rpcError;

      const rows = (data ?? []) as MyCompanyRow[];
      const nextCompanies = rowsToCompanies(rows);
      const nextMemberships = rowsToMemberships(rows, user.id);
      const nextIsSystemAdmin = rows.some((row) => row.is_system_admin);

      setCompanies(nextCompanies);
      setMemberships(nextMemberships);
      setIsSystemAdmin(nextIsSystemAdmin);

      const storedId = localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
      const storedStillValid = storedId && nextCompanies.some((company) => company.id === storedId);
      const defaultId = profileData?.default_company_id;
      const defaultStillValid = defaultId && nextCompanies.some((company) => company.id === defaultId);
      const firstCompanyId = nextCompanies[0]?.id ?? null;
      const nextActiveCompanyId = storedStillValid ? storedId : defaultStillValid ? defaultId : firstCompanyId;

      setActiveCompanyIdState(nextActiveCompanyId);
      if (nextActiveCompanyId) {
        localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, nextActiveCompanyId);
      } else {
        localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Errore caricamento aziende:', err);
      setError(err instanceof Error ? err.message : 'Errore caricamento aziende');
      setCompanies([]);
      setMemberships([]);
      setIsSystemAdmin(false);
      setActiveCompanyIdState(null);
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
  const activeMembership = memberships.find((membership) => membership.company_id === activeCompany?.id) ?? null;
  const activeRole = activeMembership?.role ?? null;

  const value = useMemo(
    () => ({
      companies,
      memberships,
      activeCompany,
      activeCompanyId: activeCompany?.id ?? null,
      activeRole,
      isSystemAdmin,
      profile,
      loading,
      error,
      setActiveCompanyId,
      refreshCompanies,
    }),
    [companies, memberships, activeCompany, activeRole, isSystemAdmin, profile, loading, error]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany deve essere usato dentro CompanyProvider');
  return context;
}
