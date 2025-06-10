
import { ShoppingCart, Utensils, LogOut, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  restaurantName?: string;
  restaurantSlogan?: string;
  logoUrl?: string;
}

const Header = ({ cartItemCount, onCartClick, restaurantName, restaurantSlogan, logoUrl }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'admin': 'Administrador',
      'caixa': 'Caixa',
      'garcon': 'Garçom',
      'entregador': 'Entregador',
      'cozinha': 'Cozinha'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      'admin': 'bg-red-500',
      'caixa': 'bg-blue-500',
      'garcon': 'bg-green-500',
      'entregador': 'bg-yellow-500',
      'cozinha': 'bg-purple-500'
    };
    return roleColors[role as keyof typeof roleColors] || 'bg-gray-500';
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="h-8 w-8 object-cover rounded-full"
                />
              ) : (
                <Utensils className="h-8 w-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{restaurantName || 'Marmita Mania'}</h1>
              <p className="text-orange-100 text-sm">{restaurantSlogan || 'Sabor caseiro na sua mesa'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Informações do usuário logado */}
            {user && profile && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <div className="text-right">
                    <p className="text-sm font-medium">{profile.name}</p>
                    <Badge 
                      className={`text-xs ${getRoleColor(profile.role)} text-white border-none`}
                      variant="secondary"
                    >
                      {getRoleDisplayName(profile.role)}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={onCartClick}
              variant="secondary"
              size="lg"
              className="relative bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Carrinho
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            <Button
              onClick={handleAuthAction}
              variant="secondary"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              {user ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
