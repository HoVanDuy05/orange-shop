import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/https';

export const useAppMutation = (url: string, method: 'post' | 'put' | 'patch' | 'delete' = 'post', invalidateKey?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api[method](url, data);
      return response.data;
    },
    onSuccess: () => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }
    },
  });
};
