import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

import { UserShell } from './components/layout/UserShell';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/Orders';

const queryClient = new QueryClient();

const theme = createTheme({
  fontFamily: 'Be Vietnam Pro, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '800',
  },
  primaryColor: 'blue',
  defaultRadius: 'md',
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications position="top-center" zIndex={2000} />
        <ModalsProvider>
          <BrowserRouter>
            <UserShell>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order-detail/:id" element={<OrderDetail />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </UserShell>
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
