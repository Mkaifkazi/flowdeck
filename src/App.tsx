import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { useInitializeData } from '@/hooks/useInitializeData';
import MainLayout from '@components/layout/MainLayout/MainLayout';

function App() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Initialize all data from JSON files
  useInitializeData();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <MainLayout />;
}

export default App;
