import { generateComment } from './generators';
import type { User, Project, Issue, Sprint, Comment } from '@types/index';
import usersData from '@/data/users.json';
import projectsData from '@/data/projects.json';
import issuesData from '@/data/issues.json';
import sprintsData from '@/data/sprints.json';

// Load data from JSON files
export const users: User[] = usersData as User[];
export const currentUser: User = users[0];

export const projects: Project[] = projectsData as Project[];
export const currentProject: Project = projects[0];

export const issues: Issue[] = issuesData as Issue[];

export const sprints: Sprint[] = sprintsData as Sprint[];

// Generate some random comments for issues
export const comments: Comment[] = issues.slice(0, 10).flatMap((issue) =>
  Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
    generateComment(issue.id, users[Math.floor(Math.random() * users.length)].id)
  )
);
