import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/App';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import ProjectBoard from '@pages/ProjectBoard';
import Backlog from '@pages/Backlog';
import Sprints from '@pages/Sprints';
import Sprint from '@pages/Sprint';
import Reports from '@pages/Reports';
import Settings from '@pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'project/:projectId/board',
        element: <ProjectBoard />,
      },
      {
        path: 'project/:projectId/backlog',
        element: <Backlog />,
      },
      {
        path: 'projects/:projectId/sprints',
        element: <Sprints />,
      },
      {
        path: 'projects/:projectId/sprints/:sprintId',
        element: <Sprint />,
      },
      {
        path: 'project/:projectId/reports',
        element: <Reports />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);
