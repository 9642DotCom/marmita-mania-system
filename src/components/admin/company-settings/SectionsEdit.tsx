
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CompanySettingsFormData } from '@/hooks/useCompanySettingsForm';

interface SectionsEditProps {
  formData: CompanySettingsFormData;
  handleInputChange: (field: string, value: string) => void;
}

export const SectionsEdit = ({ formData, handleInputChange }: SectionsEditProps) => {
  return (
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
  );
};
