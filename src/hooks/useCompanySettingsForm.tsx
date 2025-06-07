
import { useState, useEffect } from 'react';
import { useDatabase } from './useDatabase';
import { toast } from './use-toast';

export interface CompanySettingsFormData {
  restaurant_name: string;
  restaurant_slogan: string;
  logo_url: string;
  whatsapp_phone: string;
  city: string;
  state: string;
  business_hours: string;
  site_title: string;
  site_description: string;
  item1_title: string;
  item1_description: string;
  item2_title: string;
  item2_description: string;
  item3_title: string;
  item3_description: string;
}

export const useCompanySettingsForm = () => {
  const { useCompanySettings, updateCompanySettings } = useDatabase();
  const { data: settings, isLoading } = useCompanySettings();
  
  console.log('Company Settings Hook - settings:', settings);
  console.log('Company Settings Hook - isLoading:', isLoading);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CompanySettingsFormData>({
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
      console.log('Updating form data with settings:', settings);
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
    } else {
      console.log('No settings found, keeping empty form data');
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
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
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
    setIsEditing(false);
  };

  const hasData = settings && Object.values(settings).some(value => value && value !== '');
  
  console.log('Company Settings Hook - hasData:', hasData);
  console.log('Company Settings Hook - isEditing:', isEditing);

  return {
    settings,
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
    isPending: updateCompanySettings.isPending,
  };
};
