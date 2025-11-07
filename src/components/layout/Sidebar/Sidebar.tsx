import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiLayers,
  FiTrello,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleSidebar } from '@features/ui/uiSlice';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const currentProject = useAppSelector((state) => state.projects.currentProject);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const menuItems = [
    { icon: FiGrid, label: 'Dashboard', path: '/dashboard' },
    ...(currentProject ? [
      { icon: FiTrello, label: 'Board', path: `/project/${currentProject.id}/board` },
      { icon: FiLayers, label: 'Backlog', path: `/project/${currentProject.id}/backlog` },
      { icon: FiCalendar, label: 'Sprints', path: `/projects/${currentProject.id}/sprints` },
      { icon: FiBarChart2, label: 'Reports', path: `/project/${currentProject.id}/reports` },
    ] : []),
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        <Nav className="flex-column">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </Nav>
      </div>

      <button
        className="sidebar-toggle-btn"
        onClick={handleToggleSidebar}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>
    </div>
  );
};

export default Sidebar;
