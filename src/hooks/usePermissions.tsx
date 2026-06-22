import { useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';

export type AppRole =
  | 'super_admin'
  | 'company_admin'
  | 'direzione'
  | 'amministrazione'
  | 'manager'
  | 'tecnico'
  | 'capocantiere'
  | 'operaio'
  | 'consulente'
  | string;

const adminRoles = new Set(['super_admin', 'company_admin']);
const financeRoles = new Set(['super_admin', 'company_admin', 'direzione', 'amministrazione']);
const managementRoles = new Set(['super_admin', 'company_admin', 'direzione', 'manager']);

function humanRole(role?: string | null) {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    company_admin: 'Admin azienda',
    direzione: 'Direzione',
    amministrazione: 'Amministrazione',
    manager: 'Manager',
    tecnico: 'Tecnico',
    capocantiere: 'Capocantiere',
    operaio: 'Operaio',
    consulente: 'Consulente',
  };

  return labels[role ?? ''] ?? 'Consulente';
}

export function usePermissions() {
  const { memberships, activeCompanyId, isDemoFallback } = useCompany();

  return useMemo(() => {
    const activeMembership = memberships.find((membership) => membership.company_id === activeCompanyId);
    const role = (activeMembership?.role ?? (isDemoFallback ? 'super_admin' : 'consulente')) as AppRole;

    return {
      role,
      roleLabel: humanRole(role),
      canAccessAdmin: adminRoles.has(role),
      canManageCompany: adminRoles.has(role),
      canSeeFinance: financeRoles.has(role),
      canManageProjects: managementRoles.has(role) || role === 'tecnico',
      canUseInbox: role !== 'consulente',
      canUseReports: role !== 'consulente',
    };
  }, [memberships, activeCompanyId, isDemoFallback]);
}
