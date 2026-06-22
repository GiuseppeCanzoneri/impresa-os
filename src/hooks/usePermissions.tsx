import { useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';

type AppRole =
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
  if (!role) return 'Utente';
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
  return labels[role] ?? role;
}

export function usePermissions() {
  const { activeRole, isSystemAdmin } = useCompany();

  return useMemo(() => {
    const role = (isSystemAdmin ? 'super_admin' : activeRole ?? 'utente') as AppRole;

    return {
      role,
      roleLabel: humanRole(role),
      isSystemAdmin,
      canAccessAdmin: adminRoles.has(role),
      canManageCompany: adminRoles.has(role),
      canSeeFinance: financeRoles.has(role),
      canManageProjects: managementRoles.has(role) || role === 'tecnico',
      canUseInbox: role !== 'consulente',
      canUseReports: role !== 'consulente',
    };
  }, [activeRole, isSystemAdmin]);
}
