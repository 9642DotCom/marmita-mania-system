
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
      const currentPath = window.location.pathname;
      
      console.log('useRoleRedirect - Profile role:', profile.role);
      console.log('useRoleRedirect - Current path:', currentPath);
      console.log('useRoleRedirect - Target route:', targetRoute);
      
      // Redirecionar se estiver em /app
      if (targetRoute && currentPath === '/app') {
        console.log('Redirecionando de /app para:', targetRoute);
        navigate(targetRoute, { replace: true });
      }
    }
  }, [profile, loading, navigate]);

  return { profile, loading };
};
