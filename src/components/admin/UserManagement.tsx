
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import UserForm from './UserForm';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: string;
}

const UserManagement = () => {
  const { getCompanyId } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  const companyId = getCompanyId();

  useEffect(() => {
    loadUsers();
  }, [companyId]);

  const loadUsers = async () => {
    if (!companyId) return;

    try {
      // Por enquanto, usar dados mock já que não temos uma tabela de usuários específica
      // Em uma implementação real, você buscaria usuários da empresa do Supabase
      setUsers([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          role: 'caixa',
          password: '123456',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          role: 'entregador',
          password: '123456',
          createdAt: '2024-01-15'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
          name: userData.name,
          role: userData.role,
          company_id: companyId,
        }
      });

      if (authError) throw authError;

      const newUser: User = {
        ...userData,
        id: authData.user.id,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setUsers([...users, newUser]);
      setIsFormOpen(false);

      toast({
        title: "Usuário criado com sucesso!",
        description: `${userData.name} foi adicionado à equipe.`,
      });
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (!editingUser) return;

    try {
      // Atualizar metadados do usuário
      const { error } = await supabase.auth.admin.updateUserById(editingUser.id, {
        user_metadata: {
          name: userData.name,
          role: userData.role,
          company_id: companyId,
        }
      });

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...userData, id: editingUser.id, createdAt: editingUser.createdAt }
          : user
      ));
      setEditingUser(undefined);
      setIsFormOpen(false);

      toast({
        title: "Usuário atualizado com sucesso!",
        description: `${userData.name} foi atualizado.`,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) throw error;

      setUsers(users.filter(user => user.id !== id));

      toast({
        title: "Usuário removido com sucesso!",
        description: "O usuário foi removido da equipe.",
      });
    } catch (error: any) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro ao remover usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'caixa': return 'default';
      case 'entregador': return 'secondary';
      case 'cozinha': return 'destructive';
      case 'garcon': return 'outline';
      case 'admin': return 'default';
      default: return 'default';
    }
  };

  const getCategoryLabel = (role: UserRole) => {
    switch (role) {
      case 'caixa': return 'Caixa';
      case 'entregador': return 'Entregador';
      case 'cozinha': return 'Cozinha';
      case 'garcon': return 'Garçom';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  if (loading) {
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
                  <Badge variant={getCategoryBadgeVariant(user.role)}>
                    {getCategoryLabel(user.role)}
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
