
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarmitaItem } from '@/hooks/useCart';

interface MarmitaCardProps {
  marmita: MarmitaItem;
  onAddToCart: (marmita: MarmitaItem) => void;
}

const MarmitaCard = ({ marmita, onAddToCart }: MarmitaCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in group">
      <div className="relative">
        <img
          src={`https://images.unsplash.com/${marmita.image}?auto=format&fit=crop&w=400&q=80`}
          alt={marmita.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
          {marmita.category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{marmita.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{marmita.description}</p>
        
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Ingredientes:</p>
          <div className="flex flex-wrap gap-1">
            {marmita.ingredients.slice(0, 3).map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
            {marmita.ingredients.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{marmita.ingredients.length - 3}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">
            R$ {marmita.price.toFixed(2)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(marmita)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MarmitaCard;
