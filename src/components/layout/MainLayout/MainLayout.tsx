import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { useAppSelector } from '@/hooks';
import './MainLayout.css';

const MainLayout = () => {
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <div className="main-layout">
      <Header />
      <Sidebar />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
