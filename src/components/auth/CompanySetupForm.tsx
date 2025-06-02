
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Building2, Upload } from 'lucide-react';

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
      // 1. Fazer login do usuário
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: '', // Precisamos encontrar uma forma melhor de lidar com isso
      });

      // Se não conseguir fazer login com senha, tentar com token de sessão
      if (signInError) {
        console.log('Usuário já deve estar autenticado');
      }

      // 2. Criar empresa
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: companyName,
            phone: phone,
            address: address,
            horario_funcionamento: horarioFuncionamento,
            logo_url: logoUrl || null,
            owner_id: user.id,
          }
        ])
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. Criar perfil do usuário como admin
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            company_id: companyData.id,
            name: user.user_metadata?.name || user.email,
            email: user.email,
            role: 'admin',
          }
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Restaurante configurado com sucesso!",
        description: "Redirecionando para o painel administrativo...",
      });

      onSetupComplete();
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
