# FlowDeck

A modern project management and issue tracking application built with React, TypeScript, and Redux Toolkit. FlowDeck provides a comprehensive solution for managing projects, sprints, issues, and team collaboration.

## Features

- **Project Management**: Create and manage multiple projects with team members
- **Sprint Planning**: Organize work into sprints with start/end dates and goals
- **Issue Tracking**: Track tasks, bugs, stories, epics, and subtasks
- **Kanban Board**: Drag-and-drop interface for managing issue workflows
- **Backlog Management**: Prioritize and organize issues before sprint planning
- **Dashboard & Reports**: Visualize project metrics and team performance
- **Activity Timeline**: Track all changes and updates to issues
- **User Management**: Role-based access control (Admin, Project Manager, Developer, Viewer)

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **UI Framework**: React Bootstrap 5
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Yup validation
- **Charts**: Recharts
- **Styling**: Sass + Bootstrap
- **Build Tool**: Vite
- **Mocking**: MSW (Mock Service Worker)

## Project Structure

```
src/
├── api/              # Mock API setup and handlers
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── common/      # Shared components (Avatar, Badges, etc.)
│   ├── layout/      # Layout components (Header, Sidebar)
│   ├── issues/      # Issue-related components
│   ├── sprints/     # Sprint-related components
│   └── activity/    # Activity timeline components
├── features/         # Redux slices
│   ├── auth/        # Authentication state
│   ├── issues/      # Issues state
│   ├── projects/    # Projects state
│   ├── sprints/     # Sprints state
│   ├── users/       # Users state
│   └── ui/          # UI state
├── hooks/            # Custom React hooks
├── pages/            # Route pages/views
├── routes/           # Route configuration
├── store/            # Redux store setup
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flowdeck
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Details

### Issue Types
- **Task**: Standard work items
- **Bug**: Defects or issues to fix
- **Story**: User stories and features
- **Epic**: Large work items spanning multiple sprints
- **Subtask**: Breakdown of larger issues

### Priority Levels
- Highest
- High
- Medium
- Low
- Lowest

### Issue Statuses
- To Do
- In Progress
- In Review
- Done

### User Roles
- **Admin**: Full system access
- **Project Manager**: Manage projects and sprints
- **Developer**: Work on assigned issues
- **Viewer**: Read-only access

## Development

This project uses:
- **Vite** for fast development and optimized builds
- **TypeScript** for type safety
- **ESLint** for code quality
- **Mock Service Worker** for API mocking during development

## License

MIT
