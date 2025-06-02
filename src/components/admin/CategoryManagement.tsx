
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CategoryForm from './CategoryForm';

const initialCategories = [
  { id: 1, name: 'Executiva', description: 'Marmitas executivas para o dia a dia' },
  { id: 2, name: 'Fitness', description: 'Opções saudáveis e nutritivas' },
  { id: 3, name: 'Caseira', description: 'Sabor tradicional da casa da vovó' },
  { id: 4, name: 'Vegana', description: 'Opções 100% vegetais' },
  { id: 5, name: 'Gourmet', description: 'Experiência gastronômica especial' },
  { id: 6, name: 'Regional', description: 'Sabores típicos do Brasil' },
  { id: 7, name: 'Infantil', description: 'Especialmente feito para crianças' },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId: number) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    console.log('Deletar categoria:', categoryId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
        <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CategoryForm
        isOpen={showForm}
        onClose={handleCloseForm}
        category={editingCategory}
      />
    </div>
  );
};

export default CategoryManagement;
