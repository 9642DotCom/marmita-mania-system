
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CompanySettingsFormData } from '@/hooks/useCompanySettingsForm';

interface SectionsViewProps {
  formData: CompanySettingsFormData;
}

export const SectionsView = ({ formData }: SectionsViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-orange-600">Seções da Landing Page</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Seção 1</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <p className="text-gray-900 font-medium">{formData.item1_title || 'Não informado'}</p>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <p className="text-gray-900">{formData.item1_description || 'Não informado'}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Seção 2</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <p className="text-gray-900 font-medium">{formData.item2_title || 'Não informado'}</p>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <p className="text-gray-900">{formData.item2_description || 'Não informado'}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Seção 3</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <p className="text-gray-900 font-medium">{formData.item3_title || 'Não informado'}</p>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <p className="text-gray-900">{formData.item3_description || 'Não informado'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
