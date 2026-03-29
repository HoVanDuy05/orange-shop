import { useQuery } from '@tanstack/react-query';
import api from '../api/https';

export const useAppQuery = (key: string, url: string, params?: any) => {
  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      const { data } = await api.get(url, { params });
      // Return actual data object (unwrap from {success, data} response)
      return data.data || data;
    },
  });
};
