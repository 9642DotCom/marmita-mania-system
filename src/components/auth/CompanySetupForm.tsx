
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Building2 } from 'lucide-react';

interface CompanySetupFormProps {
  user: any;
  onSetupComplete: () => void;
}

const CompanySetupForm = ({ user, onSetupComplete }: CompanySetupFormProps) => {
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Configurando empresa para usuário:', user);

      // Verificar se o usuário está autenticado
      const { data: currentUser, error: userError } = await supabase.auth.getUser();
      console.log('Usuário atual:', currentUser);

      if (userError || !currentUser.user) {
        throw new Error('Erro de autenticação. Tente fazer login novamente.');
      }

      const finalUser = currentUser.user;

      // 1. Criar empresa
      console.log('Criando empresa...');
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: companyName,
            phone: phone,
            address: address,
            horario_funcionamento: horarioFuncionamento,
            logo_url: logoUrl || null,
            owner_id: finalUser.id,
          }
        ])
        .select()
        .single();

      if (companyError) {
        console.error('Erro ao criar empresa:', companyError);
        throw companyError;
      }

      console.log('Empresa criada:', companyData);

      // 2. Atualizar metadados do usuário com role e company_id
      console.log('Atualizando metadados do usuário...');
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role: 'admin',
          company_id: companyData.id,
          name: user.user_metadata?.name || finalUser.email,
        }
      });

      if (updateError) {
        console.error('Erro ao atualizar metadados:', updateError);
        throw updateError;
      }

      console.log('Usuário configurado como admin da empresa');

      toast({
        title: "Restaurante configurado com sucesso!",
        description: "Redirecionando para o painel administrativo...",
      });

      // Aguardar um pouco para que os dados sejam processados
      setTimeout(() => {
        onSetupComplete();
      }, 1000);

    } catch (error: any) {
      console.error('Erro na configuração:', error);
      toast({
        title: "Erro ao configurar restaurante",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Building2 className="h-12 w-12 text-orange-600" />
        </div>
        <CardTitle className="text-2xl">Configurar Restaurante</CardTitle>
        <p className="text-gray-600">
          Agora vamos configurar os dados do seu restaurante
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Nome do Restaurante</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Restaurante do João"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade - CEP"
              required
            />
          </div>

          <div>
            <Label htmlFor="horario">Horário de Funcionamento</Label>
            <Input
              id="horario"
              value={horarioFuncionamento}
              onChange={(e) => setHorarioFuncionamento(e.target.value)}
              placeholder="Ex: Seg-Dom 18:00-23:00"
              required
            />
          </div>

          <div>
            <Label htmlFor="logo">URL do Logo (opcional)</Label>
            <Input
              id="logo"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            Finalizar Configuração
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanySetupForm;
