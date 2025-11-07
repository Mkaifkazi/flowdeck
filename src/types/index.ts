export enum IssueType {
  TASK = 'task',
  BUG = 'bug',
  STORY = 'story',
  EPIC = 'epic',
  SUBTASK = 'subtask',
}

export enum IssuePriority {
  HIGHEST = 'highest',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  LOWEST = 'lowest',
}

export enum IssueStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export type Project = {
  id: string;
  name: string;
  key: string;
  description: string;
  ownerId: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export type Issue = {
  id: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  projectId: string;
  reporterId: string;
  assigneeId?: string;
  sprintId?: string;
  epicId?: string;
  parentId?: string;
  estimatePoints?: number;
  timeSpent?: number;
  labels: string[];
  watchers: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type Comment = {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type Sprint = {
  id: string;
  name: string;
  projectId: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  createdAt: string;
}

export type ActivityLog = {
  id: string;
  issueId: string;
  userId: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export type Board = {
  id: string;
  name: string;
  projectId: string;
  columns: BoardColumn[];
}

export type BoardColumn = {
  id: string;
  name: string;
  status: IssueStatus;
  issueIds: string[];
}
