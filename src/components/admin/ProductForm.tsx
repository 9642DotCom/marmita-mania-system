
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDatabase } from '@/hooks/useDatabase';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

const ProductForm = ({ isOpen, onClose, product }: ProductFormProps) => {
  const { createProduct, updateProduct, useCategories } = useDatabase();
  const { data: categories = [] } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    ingredients: '',
    available: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        ingredients: product.ingredients?.join(', ') || '',
        available: product.available ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        ingredients: '',
        available: true
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        category_id: formData.category_id || undefined,
        image_url: formData.image_url || undefined,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(item => item.trim()) : undefined,
        available: formData.available
      };

      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          ...productData
        });
      } else {
        await createProduct.mutateAsync(productData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-orange-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle>{product ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome do produto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição do produto"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredientes (separados por vírgula)</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                placeholder="Arroz, Feijão, Carne, Salada"
                className="min-h-[60px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({...formData, available: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="available">Disponível</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
