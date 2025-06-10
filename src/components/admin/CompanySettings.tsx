
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, X } from 'lucide-react';
import { useCompanySettingsForm } from '@/hooks/useCompanySettingsForm';
import { RestaurantInfoView } from './company-settings/RestaurantInfoView';
import { RestaurantInfoEdit } from './company-settings/RestaurantInfoEdit';
import { LandingPageView } from './company-settings/LandingPageView';
import { LandingPageEdit } from './company-settings/LandingPageEdit';
import { SectionsView } from './company-settings/SectionsView';
import { SectionsEdit } from './company-settings/SectionsEdit';

const CompanySettings = () => {
  const {
    isLoading,
    isEditing,
    setIsEditing,
    formData,
    handleInputChange,
    handleLogoChange,
    handleLogoRemove,
    handleSubmit,
    handleCancel,
    hasData,
    isPending,
  } = useCompanySettingsForm();

  console.log('CompanySettings Component - isLoading:', isLoading);
  console.log('CompanySettings Component - hasData:', hasData);
  console.log('CompanySettings Component - isEditing:', isEditing);

  if (isLoading) {
    console.log('CompanySettings: Showing loading state');
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações da Empresa</h2>
          <p className="text-gray-600">Gerencie as informações do seu restaurante e personalize a landing page</p>
        </div>
        
        {hasData && !isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Dados
          </Button>
        )}

        {isEditing && (
          <div className="flex gap-2">
            <Button 
              onClick={handleCancel}
              variant="outline"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">Nenhuma configuração encontrada</p>
              <p className="text-sm">Configure as informações da sua empresa para personalizar o site.</p>
            </div>
            <Button 
              onClick={() => {
                console.log('Setting isEditing to true from no data state');
                setIsEditing(true);
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Configurar Empresa
            </Button>
          </CardContent>
        </Card>
      ) : !isEditing ? (
        // Modo de visualização
        <div className="space-y-6">
          <RestaurantInfoView formData={formData} />
          <Separator />
          <LandingPageView formData={formData} />
          <SectionsView formData={formData} />
        </div>
      ) : (
        // Modo de edição
        <form onSubmit={handleSubmit} className="space-y-6">
          <RestaurantInfoEdit 
            formData={formData}
            handleInputChange={handleInputChange}
            handleLogoChange={handleLogoChange}
            handleLogoRemove={handleLogoRemove}
          />
          <Separator />
          <LandingPageEdit 
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <SectionsEdit 
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isPending ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanySettings;
