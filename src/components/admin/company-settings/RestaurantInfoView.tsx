
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CompanySettingsFormData } from '@/hooks/useCompanySettingsForm';

interface RestaurantInfoViewProps {
  formData: CompanySettingsFormData;
}

export const RestaurantInfoView = ({ formData }: RestaurantInfoViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-orange-600">Informações do Restaurante</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.logo_url && (
          <div className="space-y-2">
            <Label>Logo do Restaurante</Label>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Restaurante</Label>
            <p className="text-gray-900 font-medium">{formData.restaurant_name || 'Não informado'}</p>
          </div>

          <div className="space-y-2">
            <Label>Slogan</Label>
            <p className="text-gray-900 font-medium">{formData.restaurant_slogan || 'Não informado'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Telefone WhatsApp</Label>
            <p className="text-gray-900 font-medium">{formData.whatsapp_phone || 'Não informado'}</p>
          </div>

          <div className="space-y-2">
            <Label>Horário de Atendimento</Label>
            <p className="text-gray-900 font-medium">{formData.business_hours || 'Não informado'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cidade</Label>
            <p className="text-gray-900 font-medium">{formData.city || 'Não informado'}</p>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <p className="text-gray-900 font-medium">{formData.state || 'Não informado'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
