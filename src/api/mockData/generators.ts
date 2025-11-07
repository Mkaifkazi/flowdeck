import { faker } from '@faker-js/faker';
import type {
  User,
  Project,
  Issue,
  Sprint,
  Comment,
} from '@/types';
import {
  IssueType,
  IssuePriority,
  IssueStatus,
  UserRole,
} from '@/types';

export const generateUser = (): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  avatar: faker.image.avatar(),
  role: faker.helpers.arrayElement(Object.values(UserRole)),
  createdAt: faker.date.past().toISOString(),
});

export const generateProject = (ownerId: string, memberIds: string[]): Project => {
  const name = faker.company.buzzPhrase();
  return {
    id: faker.string.uuid(),
    name,
    key: name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4),
    description: faker.company.catchPhrase(),
    ownerId,
    members: [ownerId, ...memberIds],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
};

export const generateIssue = (
  projectId: string,
  projectKey: string,
  reporterId: string,
  assigneeId?: string
): Issue => {
  const issueNumber = faker.number.int({ min: 1, max: 999 });
  return {
    id: faker.string.uuid(),
    key: `${projectKey}-${issueNumber}`,
    title: faker.hacker.phrase(),
    description: faker.lorem.paragraphs(2),
    type: faker.helpers.arrayElement(Object.values(IssueType)),
    priority: faker.helpers.arrayElement(Object.values(IssuePriority)),
    status: faker.helpers.arrayElement(Object.values(IssueStatus)),
    projectId,
    reporterId,
    assigneeId,
    estimatePoints: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 13 })),
    labels: faker.helpers.arrayElements(['bug', 'feature', 'enhancement', 'documentation'], {
      min: 0,
      max: 2,
    }),
    watchers: [],
    dueDate: faker.helpers.maybe(() => faker.date.future().toISOString()),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
};

export const generateSprint = (projectId: string): Sprint => ({
  id: faker.string.uuid(),
  name: `Sprint ${faker.number.int({ min: 1, max: 20 })}`,
  projectId,
  goal: faker.company.catchPhrase(),
  startDate: faker.date.recent().toISOString(),
  endDate: faker.date.soon({ days: 14 }).toISOString(),
  status: faker.helpers.arrayElement(['planned', 'active', 'completed'] as const),
  createdAt: faker.date.past().toISOString(),
});

export const generateComment = (issueId: string, userId: string): Comment => ({
  id: faker.string.uuid(),
  issueId,
  userId,
  content: faker.lorem.paragraph(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
