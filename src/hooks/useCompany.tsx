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
  isDemoFallback: boolean;
  setActiveCompanyId: (companyId: string) => void;
  refreshCompanies: () => Promise<void>;
}

type CompanyRpcRow = Company & {
  member_id?: string | null;
  profile_id?: string | null;
  role?: UserRole | null;
  is_active?: boolean | null;
  is_system_admin?: boolean | null;
};

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);
const ACTIVE_COMPANY_STORAGE_KEY = 'impresaos_active_company_id';

function getStoredActiveCompanyId() {
  try {
    return localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveActiveCompanyId(companyId: string | null) {
  try {
    if (!companyId) {
      localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY);
      return;
    }
    localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, companyId);
  } catch {
    // Ignore storage errors.
  }
}

function getDemoCompanies() {
  return mockCompanies.map((company) => ({
    ...company,
    name: company.name || 'Erelma S.r.l.',
    plan: company.plan || 'enterprise',
    status: company.status || 'active',
  }));
}

function getDemoMemberships(userId?: string | null): CompanyMember[] {
  const profileId = userId ?? 'demo-super-admin';
  return getDemoCompanies().map((company, index) => ({
    id: `demo-member-${index + 1}`,
    company_id: company.id,
    profile_id: profileId,
    role: 'super_admin' as UserRole,
    is_active: true,
    created_at: company.created_at,
    updated_at: company.updated_at,
  }));
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [memberships, setMemberships] = useState<CompanyMember[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  function applyDemoFallback(reason?: string | null) {
    const nextCompanies = getDemoCompanies();
    const nextMemberships = getDemoMemberships(user?.id);
    const storedId = getStoredActiveCompanyId();
    const storedStillValid = Boolean(storedId && nextCompanies.some((company) => company.id === storedId));
    const nextActiveCompanyId = storedStillValid ? storedId : nextCompanies[0]?.id ?? null;

    setCompanies(nextCompanies);
    setMemberships(nextMemberships);
    setActiveCompanyIdState(nextActiveCompanyId);
    saveActiveCompanyId(nextActiveCompanyId);
    setIsDemoFallback(true);
    setError(reason ?? null);
    setLoading(false);
  }

  async function loadCompaniesWithRpc() {
    if (!supabase) return null;

    const { data, error: rpcError } = await supabase.rpc('get_my_companies');
    if (rpcError) throw rpcError;

    const rows = (data ?? []) as CompanyRpcRow[];
    if (rows.length === 0) return { nextCompanies: [], nextMemberships: [] };

    const nextCompanies: Company[] = rows
      .filter((row) => row.id && isValidUuid(String(row.id)))
      .map((row) => ({
        id: String(row.id),
        name: row.name,
        vat_number: row.vat_number ?? null,
        fiscal_code: row.fiscal_code ?? null,
        logo_url: row.logo_url ?? null,
        plan: row.plan ?? 'enterprise',
        status: row.status ?? 'active',
        settings: {},
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

    const nextMemberships: CompanyMember[] = rows
      .filter((row) => row.id && isValidUuid(String(row.id)))
      .map((row) => ({
        id: row.member_id ?? `${row.id}-${user?.id ?? 'me'}`,
        company_id: String(row.id),
        profile_id: row.profile_id ?? user?.id ?? '',
        role: (row.is_system_admin ? 'super_admin' : row.role ?? 'consulente') as UserRole,
        is_active: row.is_active ?? true,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

    return { nextCompanies, nextMemberships };
  }

  async function refreshCompanies() {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      applyDemoFallback(null);
      return;
    }

    if (!supabase || !user) {
      setCompanies([]);
      setMemberships([]);
      setActiveCompanyIdState(null);
      saveActiveCompanyId(null);
      setIsDemoFallback(false);
      setLoading(false);
      return;
    }

    try {
      const loaded = await loadCompaniesWithRpc();
      const nextCompanies = loaded?.nextCompanies ?? [];
      const nextMemberships = loaded?.nextMemberships ?? [];

      if (nextCompanies.length === 0) {
        applyDemoFallback('Nessuna azienda reale trovata: uso dati demo per la presentazione.');
        return;
      }

      const storedId = getStoredActiveCompanyId();
      const storedStillValid = Boolean(storedId && nextCompanies.some((company) => company.id === storedId));
      const nextActiveCompanyId = storedStillValid ? storedId : nextCompanies[0]?.id ?? null;

      setCompanies(nextCompanies);
      setMemberships(nextMemberships);
      setActiveCompanyIdState(nextActiveCompanyId);
      saveActiveCompanyId(nextActiveCompanyId);
      setIsDemoFallback(false);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Errore caricamento aziende:', err);
      applyDemoFallback('Connessione Supabase non disponibile: uso dati demo per la presentazione.');
    }
  }

  useEffect(() => {
    refreshCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function setActiveCompanyId(companyId: string) {
    const exists = companies.some((company) => company.id === companyId);
    if (!exists) return;

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
      isDemoFallback,
      setActiveCompanyId,
      refreshCompanies,
    }),
    [companies, memberships, activeCompany, loading, error, isDemoFallback]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany deve essere usato dentro CompanyProvider');
  return context;
}
