
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Profile } from '@/types/database';

const roleRoutes: Record<Profile['role'], string> = {
  admin: '/admin',
  caixa: '/caixa',
  entregador: '/entregador',
  cozinha: '/cozinha',
  garcon: '/garcon'
};

export const useRoleRedirect = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile?.role) {
      const targetRoute = roleRoutes[profile.role];
      if (targetRoute && window.location.pathname === '/') {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [profile, loading, navigate]);

  return { profile, loading };
};
