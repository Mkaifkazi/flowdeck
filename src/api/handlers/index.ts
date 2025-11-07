import { http, HttpResponse } from 'msw';
import { users, currentUser, projects, currentProject, issues, sprints, comments } from '../mockData/seed';

export const handlers = [
  // Auth
  http.post('/api/auth/login', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({
      user: currentUser,
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/register', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return HttpResponse.json({
      user: currentUser,
      token: 'mock-jwt-token',
    });
  }),

  // Users
  http.get('/api/users', () => {
    return HttpResponse.json(users);
  }),

  // Projects
  http.get('/api/projects', () => {
    return HttpResponse.json(projects);
  }),

  http.get('/api/projects/:id', ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    return project ? HttpResponse.json(project) : new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/projects', async ({ request }) => {
    const body = await request.json() as Partial<typeof currentProject>;
    const newProject = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject as typeof currentProject);
    return HttpResponse.json(newProject);
  }),

  // Issues
  http.get('/api/projects/:projectId/issues', ({ params }) => {
    const projectIssues = issues.filter((i) => i.projectId === params.projectId);
    return HttpResponse.json(projectIssues);
  }),

  http.get('/api/issues/:id', ({ params }) => {
    const issue = issues.find((i) => i.id === params.id);
    return issue ? HttpResponse.json(issue) : new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/issues', async ({ request }) => {
    const body = await request.json() as Partial<typeof issues[0]>;
    const newIssue = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    issues.push(newIssue as typeof issues[0]);
    return HttpResponse.json(newIssue);
  }),

  http.patch('/api/issues/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<typeof issues[0]>;
    const index = issues.findIndex((i) => i.id === params.id);
    if (index !== -1) {
      issues[index] = { ...issues[index], ...body, updatedAt: new Date().toISOString() };
      return HttpResponse.json(issues[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/issues/:id', ({ params }) => {
    const index = issues.findIndex((i) => i.id === params.id);
    if (index !== -1) {
      issues.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Sprints
  http.get('/api/projects/:projectId/sprints', ({ params }) => {
    const projectSprints = sprints.filter((s) => s.projectId === params.projectId);
    return HttpResponse.json(projectSprints);
  }),

  http.post('/api/sprints', async ({ request }) => {
    const body = await request.json() as Partial<typeof sprints[0]>;
    const newSprint = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    sprints.push(newSprint as typeof sprints[0]);
    return HttpResponse.json(newSprint);
  }),

  // Comments
  http.get('/api/issues/:issueId/comments', ({ params }) => {
    const issueComments = comments.filter((c) => c.issueId === params.issueId);
    return HttpResponse.json(issueComments);
  }),

  http.post('/api/comments', async ({ request }) => {
    const body = await request.json() as Partial<typeof comments[0]>;
    const newComment = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    comments.push(newComment as typeof comments[0]);
    return HttpResponse.json(newComment);
  }),
];
