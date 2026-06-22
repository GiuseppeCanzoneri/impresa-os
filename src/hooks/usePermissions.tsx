import { useEffect, useMemo, useState } from 'react';
import { requireSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';

type PermissionState = {
  loading: boolean;
  role: string | null;
  isSystemAdmin: boolean;
  canViewAdmin: boolean;
  canManageUsers: boolean;
  canManageCompany: boolean;
  canManageSettings: boolean;
  canViewFinancials: boolean;
};

const INITIAL_STATE: PermissionState = {
  loading: true,
  role: null,
  isSystemAdmin: false,
  canViewAdmin: false,
  canManageUsers: false,
  canManageCompany: false,
  canManageSettings: false,
  canViewFinancials: false,
};

export function usePermissions(): PermissionState {
  const { user } = useAuth();
  const { activeCompanyId } = useCompany();
  const [state, setState] = useState<PermissionState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    async function loadPermissions() {
      if (!isSupabaseConfigured || !user) {
        if (!cancelled) setState({ ...INITIAL_STATE, loading: false });
        return;
      }

      try {
        const supabase = requireSupabase();

        const { data: isSystemAdminData, error: adminError } = await supabase.rpc('current_user_is_system_admin');
        if (adminError) throw adminError;

        let role: string | null = null;
        if (activeCompanyId) {
          const { data: roleData, error: roleError } = await supabase.rpc('get_my_company_role', {
            p_company_id: activeCompanyId,
          });
          if (roleError) throw roleError;
          role = roleData ?? null;
        }

        const isSystemAdmin = Boolean(isSystemAdminData);
        const effectiveRole = isSystemAdmin ? 'super_admin' : role;
        const canManageCompany = isSystemAdmin || effectiveRole === 'company_admin';
        const canViewAdmin = canManageCompany;
        const canViewFinancials = isSystemAdmin || ['company_admin', 'direzione', 'amministrazione'].includes(effectiveRole ?? '');

        if (!cancelled) {
          setState({
            loading: false,
            role: effectiveRole,
            isSystemAdmin,
            canViewAdmin,
            canManageUsers: canManageCompany,
            canManageCompany,
            canManageSettings: canManageCompany,
            canViewFinancials,
          });
        }
      } catch (error) {
        console.error('Errore caricamento permessi:', error);
        if (!cancelled) setState({ ...INITIAL_STATE, loading: false });
      }
    }

    loadPermissions();

    return () => {
      cancelled = true;
    };
  }, [user, activeCompanyId]);

  return useMemo(() => state, [state]);
}
