import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { phoneNumber } = useUserStore();

  // Check if user is actually logged in (has phone number and password in localStorage)
  const isLoggedIn = () => {
    const storedPhone = localStorage.getItem('iuh-user-cart');
    const hasPassword = localStorage.getItem('userPassword');

    if (!phoneNumber.trim() || !hasPassword) {
      return false;
    }

    // Parse stored data to verify phone number matches
    if (storedPhone) {
      try {
        const parsed = JSON.parse(storedPhone);
        return parsed.state?.phoneNumber === phoneNumber.trim();
      } catch {
        return false;
      }
    }

    return false;
  };

  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
