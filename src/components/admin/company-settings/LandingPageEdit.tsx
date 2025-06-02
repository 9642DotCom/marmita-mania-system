
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanySettingsFormData } from '@/hooks/useCompanySettingsForm';

interface LandingPageEditProps {
  formData: CompanySettingsFormData;
  handleInputChange: (field: string, value: string) => void;
}

export const LandingPageEdit = ({ formData, handleInputChange }: LandingPageEditProps) => {
  return (
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
  );
};
