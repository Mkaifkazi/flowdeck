import usersData from './users.json';
import projectsData from './projects.json';
import sprintsData from './sprints.json';
import issuesData from './issues.json';

export const users = usersData;
export const projects = projectsData;
export const sprints = sprintsData;
export const issues = issuesData;

// Current user for demo (first admin user)
export const currentUser = users[0];

// Current project (first project)
export const currentProject = projects[0];
