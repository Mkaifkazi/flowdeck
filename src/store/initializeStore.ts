import type { AppDispatch } from './index';
import { setUser } from '@features/auth/authSlice';
import { setProjects, setCurrentProject } from '@features/projects/projectsSlice';
import { setIssues } from '@features/issues/issuesSlice';
import { setSprints, setActiveSprint } from '@features/sprints/sprintsSlice';
import { setUsers } from '@features/users/usersSlice';
import { users, currentUser, projects, currentProject, issues, sprints } from '@/api/mockData/seed';

export const initializeStore = (dispatch: AppDispatch) => {
  // Initialize auth with current user
  dispatch(setUser(currentUser));

  // Initialize projects
  dispatch(setProjects(projects));
  dispatch(setCurrentProject(currentProject));

  // Initialize issues
  dispatch(setIssues(issues));

  // Initialize sprints
  dispatch(setSprints(sprints));
  const activeSprint = sprints.find(s => s.status === 'active');
  if (activeSprint) {
    dispatch(setActiveSprint(activeSprint));
  }

  // Initialize users
  dispatch(setUsers(users));
};
