
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDatabase } from '@/hooks/useDatabase';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
}

const CategoryForm = ({ isOpen, onClose, category }: CategoryFormProps) => {
  const { createCategory, updateCategory } = useDatabase();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (category) {
        await updateCategory.mutateAsync({
          id: category.id,
          ...formData
        });
      } else {
        await createCategory.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-orange-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle>{category ? 'Editar Categoria' : 'Nova Categoria'}</CardTitle>
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
                placeholder="Nome da categoria"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição da categoria"
                className="min-h-[80px]"
              />
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
                {isSubmitting ? 'Salvando...' : (category ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;
