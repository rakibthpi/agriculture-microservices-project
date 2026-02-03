'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  category: { name: string };
  stock: number;
}

export function useProducts(params?: any) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });
}
