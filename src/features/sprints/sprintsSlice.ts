import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Sprint } from '@/types';

interface SprintsState {
  sprints: Sprint[];
  activeSprint: Sprint | null;
  isLoading: boolean;
}

const initialState: SprintsState = {
  sprints: [],
  activeSprint: null,
  isLoading: false,
};

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    setSprints: (state, action: PayloadAction<Sprint[]>) => {
      state.sprints = action.payload;
    },
    setActiveSprint: (state, action: PayloadAction<Sprint | null>) => {
      state.activeSprint = action.payload;
    },
    addSprint: (state, action: PayloadAction<Sprint>) => {
      state.sprints.push(action.payload);
    },
    updateSprint: (state, action: PayloadAction<Sprint>) => {
      const index = state.sprints.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sprints[index] = action.payload;
      }
      if (state.activeSprint?.id === action.payload.id) {
        state.activeSprint = action.payload;
      }
    },
    deleteSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter((s) => s.id !== action.payload);
      if (state.activeSprint?.id === action.payload) {
        state.activeSprint = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSprints,
  setActiveSprint,
  addSprint,
  updateSprint,
  deleteSprint,
  setLoading,
} = sprintsSlice.actions;
export default sprintsSlice.reducer;
