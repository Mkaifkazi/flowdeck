import { useEffect } from 'react';
import { useAppDispatch } from './index';
import { setUsers } from '@features/users/usersSlice';
import { setProjects, setCurrentProject } from '@features/projects/projectsSlice';
import { setIssues } from '@features/issues/issuesSlice';
import { setSprints } from '@features/sprints/sprintsSlice';
import usersData from '@/data/users.json';
import projectsData from '@/data/projects.json';
import issuesData from '@/data/issues.json';
import sprintsData from '@/data/sprints.json';

export const useInitializeData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load all data from JSON files into Redux store
    dispatch(setUsers(usersData as any));
    dispatch(setProjects(projectsData as any));
    dispatch(setCurrentProject(projectsData[0] as any));
    dispatch(setIssues(issuesData as any));
    dispatch(setSprints(sprintsData as any));
  }, [dispatch]);
};
