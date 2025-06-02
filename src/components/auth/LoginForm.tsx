
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import SignUpForm from './SignUpForm';
import CompanySetupForm from './CompanySetupForm';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'login' | 'signup' | 'company-setup'>('login');
  const [newUser, setNewUser] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });

      // Redirecionar para a página principal
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSuccess = (user: any) => {
    console.log('Usuário criado com sucesso:', user);
    setNewUser(user);
    setCurrentStep('company-setup');
  };

  const handleCompanySetupComplete = () => {
    console.log('Configuração da empresa finalizada, redirecionando...');
    window.location.href = '/admin';
  };

  if (currentStep === 'signup') {
    return (
      <SignUpForm 
        onSignUpSuccess={handleSignUpSuccess}
        onBackToLogin={() => setCurrentStep('login')}
      />
    );
  }

  if (currentStep === 'company-setup') {
    return (
      <CompanySetupForm 
        user={newUser}
        onSetupComplete={handleCompanySetupComplete}
      />
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Building2 className="h-12 w-12 text-orange-600" />
        </div>
        <CardTitle className="text-2xl">Fazer Login</CardTitle>
        <p className="text-gray-600">
          Entre na sua conta para continuar
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            Entrar
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setCurrentStep('signup')}
            className="text-orange-600"
          >
            Não tem conta? Criar empresa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
