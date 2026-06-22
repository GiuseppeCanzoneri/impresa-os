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
  const { memberships, activeCompanyId } = useCompany();

  return useMemo(() => {
    const activeMembership = memberships.find((membership) => membership.company_id === activeCompanyId);

    // Fallback prudente: se il ruolo non è disponibile, l'interfaccia assume il privilegio minimo.
    // La sicurezza reale resta comunque nelle RLS di Supabase.
    const role = (activeMembership?.role ?? 'consulente') as AppRole;

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
  }, [memberships, activeCompanyId]);
}
