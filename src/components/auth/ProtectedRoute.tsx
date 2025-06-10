
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Profile } from '@/types/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Profile['role'][];
  redirectTo?: string;
}

const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/auth' }: ProtectedRouteProps) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.294 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Role atual: <span className="font-medium">{profile.role}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Roles permitidas: <span className="font-medium">{allowedRoles.join(', ')}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
