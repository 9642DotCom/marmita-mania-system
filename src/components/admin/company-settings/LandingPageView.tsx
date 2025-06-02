
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CompanySettingsFormData } from '@/hooks/useCompanySettingsForm';

interface LandingPageViewProps {
  formData: CompanySettingsFormData;
}

export const LandingPageView = ({ formData }: LandingPageViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-orange-600">Personalização da Landing Page</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Título do Site</Label>
            <p className="text-gray-900 font-medium">{formData.site_title || 'Não informado'}</p>
          </div>

          <div className="space-y-2">
            <Label>Descrição do Site</Label>
            <p className="text-gray-900">{formData.site_description || 'Não informado'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
