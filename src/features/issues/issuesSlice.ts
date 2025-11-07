import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Issue } from '@types/index';

interface IssuesState {
  issues: Issue[];
  currentIssue: Issue | null;
  isLoading: boolean;
}

const initialState: IssuesState = {
  issues: [],
  currentIssue: null,
  isLoading: false,
};

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<Issue[]>) => {
      state.issues = action.payload;
    },
    setCurrentIssue: (state, action: PayloadAction<Issue | null>) => {
      state.currentIssue = action.payload;
    },
    addIssue: (state, action: PayloadAction<Issue>) => {
      state.issues.push(action.payload);
    },
    updateIssue: (state, action: PayloadAction<Issue>) => {
      const index = state.issues.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.issues[index] = action.payload;
      }
      if (state.currentIssue?.id === action.payload.id) {
        state.currentIssue = action.payload;
      }
    },
    deleteIssue: (state, action: PayloadAction<string>) => {
      state.issues = state.issues.filter((i) => i.id !== action.payload);
      if (state.currentIssue?.id === action.payload) {
        state.currentIssue = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setIssues,
  setCurrentIssue,
  addIssue,
  updateIssue,
  deleteIssue,
  setLoading,
} = issuesSlice.actions;
export default issuesSlice.reducer;
