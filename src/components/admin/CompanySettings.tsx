
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useDatabase } from '@/hooks/useDatabase';
import { toast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';

const CompanySettings = () => {
  const { useCompanySettings, updateCompanySettings } = useDatabase();
  const { data: settings, isLoading } = useCompanySettings();
  
  const [formData, setFormData] = useState({
    restaurant_name: '',
    restaurant_slogan: '',
    logo_url: '',
    whatsapp_phone: '',
    city: '',
    state: '',
    business_hours: '',
    site_title: '',
    site_description: '',
    item1_title: '',
    item1_description: '',
    item2_title: '',
    item2_description: '',
    item3_title: '',
    item3_description: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        restaurant_name: settings.restaurant_name || '',
        restaurant_slogan: settings.restaurant_slogan || '',
        logo_url: settings.logo_url || '',
        whatsapp_phone: settings.whatsapp_phone || '',
        city: settings.city || '',
        state: settings.state || '',
        business_hours: settings.business_hours || '',
        site_title: settings.site_title || '',
        site_description: settings.site_description || '',
        item1_title: settings.item1_title || '',
        item1_description: settings.item1_description || '',
        item2_title: settings.item2_title || '',
        item2_description: settings.item2_description || '',
        item3_title: settings.item3_title || '',
        item3_description: settings.item3_description || '',
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      logo_url: url
    }));
  };

  const handleLogoRemove = () => {
    setFormData(prev => ({
      ...prev,
      logo_url: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateCompanySettings.mutateAsync(formData);
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações da Empresa</h2>
        <p className="text-gray-600">Gerencie as informações do seu restaurante e personalize a landing page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configurações do Restaurante */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">Informações do Restaurante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo do Restaurante</Label>
              <ImageUpload
                currentImageUrl={formData.logo_url}
                onImageChange={handleLogoChange}
                onImageRemove={handleLogoRemove}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant_name">Nome do Restaurante</Label>
                <Input
                  id="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                  placeholder="Nome do seu restaurante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restaurant_slogan">Slogan</Label>
                <Input
                  id="restaurant_slogan"
                  value={formData.restaurant_slogan}
                  onChange={(e) => handleInputChange('restaurant_slogan', e.target.value)}
                  placeholder="Slogan do restaurante"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_phone">Telefone WhatsApp</Label>
                <Input
                  id="whatsapp_phone"
                  value={formData.whatsapp_phone}
                  onChange={(e) => handleInputChange('whatsapp_phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_hours">Horário de Atendimento</Label>
                <Input
                  id="business_hours"
                  value={formData.business_hours}
                  onChange={(e) => handleInputChange('business_hours', e.target.value)}
                  placeholder="Seg a Dom: 18h às 23h"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Nome da cidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="UF do estado"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Configurações da Landing Page */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">Personalização da Landing Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Título do Site</Label>
                <Input
                  id="site_title"
                  value={formData.site_title}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  placeholder="Título principal da página"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Descrição do Site</Label>
                <Textarea
                  id="site_description"
                  value={formData.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="Descrição do seu site"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seções da Landing Page */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">Seções da Landing Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Item 1 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Seção 1</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item1_title">Título do Item 1</Label>
                  <Input
                    id="item1_title"
                    value={formData.item1_title}
                    onChange={(e) => handleInputChange('item1_title', e.target.value)}
                    placeholder="Título da primeira seção"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item1_description">Descrição do Item 1</Label>
                  <Textarea
                    id="item1_description"
                    value={formData.item1_description}
                    onChange={(e) => handleInputChange('item1_description', e.target.value)}
                    placeholder="Descrição da primeira seção"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Item 2 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Seção 2</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item2_title">Título do Item 2</Label>
                  <Input
                    id="item2_title"
                    value={formData.item2_title}
                    onChange={(e) => handleInputChange('item2_title', e.target.value)}
                    placeholder="Título da segunda seção"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item2_description">Descrição do Item 2</Label>
                  <Textarea
                    id="item2_description"
                    value={formData.item2_description}
                    onChange={(e) => handleInputChange('item2_description', e.target.value)}
                    placeholder="Descrição da segunda seção"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Item 3 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Seção 3</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item3_title">Título do Item 3</Label>
                  <Input
                    id="item3_title"
                    value={formData.item3_title}
                    onChange={(e) => handleInputChange('item3_title', e.target.value)}
                    placeholder="Título da terceira seção"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item3_description">Descrição do Item 3</Label>
                  <Textarea
                    id="item3_description"
                    value={formData.item3_description}
                    onChange={(e) => handleInputChange('item3_description', e.target.value)}
                    placeholder="Descrição da terceira seção"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700"
            disabled={updateCompanySettings.isPending}
          >
            {updateCompanySettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
