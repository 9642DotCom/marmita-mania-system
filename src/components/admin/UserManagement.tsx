
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useDatabase } from '@/hooks/useDatabase';
import UserForm from './UserForm';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'caixa' | 'entregador' | 'cozinha' | 'garcon';
  created_at: string;
}

const UserManagement = () => {
  const { useUsers, deleteUser } = useDatabase();
  const { data: users = [], isLoading } = useUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      deleteUser.mutate(id);
    }
  };

  const getCategoryBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'default';
      case 'caixa': return 'default';
      case 'entregador': return 'secondary';
      case 'cozinha': return 'destructive';
      case 'garcon': return 'outline';
      default: return 'default';
    }
  };

  const getCategoryLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'caixa': return 'Caixa';
      case 'entregador': return 'Entregador';
      case 'cozinha': return 'Cozinha';
      case 'garcon': return 'Garçom';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-gray-500">
              Nenhum usuário encontrado. Clique em "Adicionar Usuário" para criar o primeiro.
            </div>
          </CardContent>
        </Card>
      ) : (
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
                    <Badge variant={getCategoryBadgeVariant(user.role as User['role'])}>
                      {getCategoryLabel(user.role as User['role'])}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingUser(user as User);
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
      )}

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onSubmit={() => {
            setIsFormOpen(false);
            setEditingUser(undefined);
          }}
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
