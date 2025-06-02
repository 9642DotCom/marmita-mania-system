
import { ShoppingCart, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Utensils className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Marmita Mania</h1>
              <p className="text-orange-100 text-sm">Sabor caseiro na sua mesa</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
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
              onClick={handleSignOut}
              variant="secondary"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
        {user && (
          <div className="mt-2">
            <p className="text-orange-100 text-sm">
              Bem-vindo, {user.user_metadata?.name || user.email}
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
