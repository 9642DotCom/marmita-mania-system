
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import UserForm from './UserForm';

export interface User {
  id: string;
  name: string;
  email: string;
  category: 'caixa' | 'entregador' | 'cozinha' | 'garcon';
  password: string;
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      category: 'caixa',
      password: '123456',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      category: 'entregador',
      password: '123456',
      createdAt: '2024-01-15'
    }
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setIsFormOpen(false);
  };

  const handleEditUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...userData, id: editingUser.id, createdAt: editingUser.createdAt }
          : user
      ));
      setEditingUser(undefined);
      setIsFormOpen(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const getCategoryBadgeVariant = (category: User['category']) => {
    switch (category) {
      case 'caixa': return 'default';
      case 'entregador': return 'secondary';
      case 'cozinha': return 'destructive';
      case 'garcon': return 'outline';
      default: return 'default';
    }
  };

  const getCategoryLabel = (category: User['category']) => {
    switch (category) {
      case 'caixa': return 'Caixa';
      case 'entregador': return 'Entregador';
      case 'cozinha': return 'Cozinha';
      case 'garcon': return 'Garçom';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getCategoryBadgeVariant(user.category)}>
                    {getCategoryLabel(user.category)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingUser(user);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleEditUser : handleAddUser}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingUser(undefined);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
