import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  showIssueModal: boolean;
  showProjectModal: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  theme: 'light',
  showIssueModal: false,
  showProjectModal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setShowIssueModal: (state, action: PayloadAction<boolean>) => {
      state.showIssueModal = action.payload;
    },
    setShowProjectModal: (state, action: PayloadAction<boolean>) => {
      state.showProjectModal = action.payload;
    },
  },
});

export const { toggleSidebar, setTheme, setShowIssueModal, setShowProjectModal } = uiSlice.actions;
export default uiSlice.reducer;
