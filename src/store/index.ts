import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import projectsReducer from '@features/projects/projectsSlice';
import issuesReducer from '@features/issues/issuesSlice';
import sprintsReducer from '@features/sprints/sprintsSlice';
import usersReducer from '@features/users/usersSlice';
import uiReducer from '@features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    issues: issuesReducer,
    sprints: sprintsReducer,
    users: usersReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
