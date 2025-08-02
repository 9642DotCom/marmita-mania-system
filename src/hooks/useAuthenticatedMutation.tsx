
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface UseAuthenticatedMutationOptions<TData, TError, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  queryKey?: string[];
}

export function useAuthenticatedMutation<TData, TError, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  queryKey,
}: UseAuthenticatedMutationOptions<TData, TError, TVariables>) {
  const { refreshTokenIfNeeded } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      // Verificar e renovar token antes da operação
      const isTokenValid = await refreshTokenIfNeeded();
      if (!isTokenValid) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      try {
        return await mutationFn(variables);
      } catch (error: any) {
        // Se o erro for de JWT expirado, tentar renovar e repetir
        if (error?.code === 'PGRST301' || error?.message?.includes('JWT expired')) {
          console.log('Token expirado durante operação, tentando renovar...');
          const renewed = await refreshTokenIfNeeded();
          if (renewed) {
            // Tentar novamente após renovar
            return await mutationFn(variables);
          }
        }
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
      onSuccess?.(data, variables);
    },
    onError: (error: any, variables) => {
      console.error('Erro na operação:', error);
      
      if (error?.code === 'PGRST301' || error?.message?.includes('JWT expired')) {
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Faça login novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro na operação",
          description: error?.message || "Ocorreu um erro inesperado",
          variant: "destructive"
        });
      }
      
      onError?.(error, variables);
    },
  });
}
