'use client';

import { createContext, useContext, useEffect, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { generateColors } from '@mantine/colors-generator';

const API_URL = import.meta.env.VITE_API_URL;

export interface BrandTheme {
  id: number;
  brand_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family?: string;
  target_type?: 'admin' | 'client' | 'global';
  active: boolean;
}

interface ThemeContextType {
  activeTheme: BrandTheme | null;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({ activeTheme: null, isLoading: false });

export const useBrandTheme = () => useContext(ThemeContext);

export const BrandThemeProvider = ({ children }: { children: ReactNode }) => {
  const { data: themes = [], isLoading } = useQuery<BrandTheme[]>({
    queryKey: ['themes'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/system/themes`);
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // For User/Client app, we look for 'client' or 'global' theme
  const activeTheme = useMemo(() => {
    return themes.find(t => t.target_type === 'client') || 
           themes.find(t => t.target_type === 'global') || 
           themes[0] || null;
  }, [themes]);

  const brandColors = useMemo<MantineColorsTuple>(() => {
    const primary = activeTheme?.primary_color || '#FF6B00';
    return generateColors(primary) as unknown as MantineColorsTuple;
  }, [activeTheme]);

  const dynamicTheme = useMemo(() => createTheme({
    fontFamily: activeTheme?.font_family || 'Be Vietnam Pro, sans-serif',
    headings: {
      fontFamily: activeTheme?.font_family || 'Be Vietnam Pro, sans-serif',
      fontWeight: '800',
    },
    colors: {
      brand: brandColors,
    },
    primaryColor: 'brand',
    defaultRadius: 'md',
  }), [activeTheme, brandColors]);

  useEffect(() => {
    if (activeTheme) {
      const root = document.documentElement;
      const primary = activeTheme.primary_color || '#FF6B00';
      root.style.setProperty('--brand-primary', primary);
      root.style.setProperty('--brand-primary-soft', `${primary}1A`);
      root.style.setProperty('--brand-secondary', activeTheme.secondary_color || '#FF8533');
      root.style.setProperty('--brand-font', activeTheme.font_family || 'Be Vietnam Pro');
      
      if (activeTheme.brand_name) document.title = activeTheme.brand_name;
      if (activeTheme.logo_url) {
        let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = activeTheme.logo_url;
      }
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, isLoading }}>
      <MantineProvider theme={dynamicTheme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};
