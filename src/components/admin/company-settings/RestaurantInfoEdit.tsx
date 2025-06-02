
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanySettingsFormData } from '@/hooks/useCompanySettingsForm';
import ImageUpload from '../ImageUpload';

interface RestaurantInfoEditProps {
  formData: CompanySettingsFormData;
  handleInputChange: (field: string, value: string) => void;
  handleLogoChange: (url: string) => void;
  handleLogoRemove: () => void;
}

export const RestaurantInfoEdit = ({ 
  formData, 
  handleInputChange, 
  handleLogoChange, 
  handleLogoRemove 
}: RestaurantInfoEditProps) => {
  return (
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
  );
};
