
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';

export const useCompanySettings = () => {
  const { profile } = useAuth();

  const companySettingsQuery = useQuery({
    queryKey: ['company-settings', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) {
        console.log('No company_id found in profile, skipping company settings query');
        return null;
      }
      
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', profile.company_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company settings:', error);
        throw error;
      }
      return data || null;
    },
    enabled: !!profile?.company_id,
  });

  const updateCompanySettings = useAuthenticatedMutation({
    mutationFn: async (settingsData: {
      restaurant_name?: string;
      restaurant_slogan?: string;
      logo_url?: string;
      site_title?: string;
      site_description?: string;
      item1_title?: string;
      item1_description?: string;
      item2_title?: string;
      item2_description?: string;
      item3_title?: string;
      item3_description?: string;
      whatsapp_phone?: string;
      city?: string;
      state?: string;
      business_hours?: string;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      const { data: existingData } = await supabase
        .from('company_settings')
        .select('id')
        .eq('company_id', profile.company_id)
        .single();

      if (existingData) {
        const { data, error } = await supabase
          .from('company_settings')
          .update(settingsData)
          .eq('company_id', profile.company_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('company_settings')
          .insert([
            {
              ...settingsData,
              company_id: profile.company_id,
            }
          ])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    queryKey: ['company-settings'],
  });

  return {
    useCompanySettings: () => companySettingsQuery,
    updateCompanySettings,
  };
};
