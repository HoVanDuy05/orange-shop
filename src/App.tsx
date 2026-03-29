import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

import { UserShell } from './components/layout/UserShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CategoryPage from './pages/CategoryPage';
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

import { BrandThemeProvider } from './providers/BrandThemeProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrandThemeProvider>
        <Notifications position="top-center" zIndex={2000} />
        <ModalsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />

              {/* Layout Route for UserShell */}
              <Route element={<UserShell />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/order-detail/:id" element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } />
              </Route>

              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ModalsProvider>
      </BrandThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
