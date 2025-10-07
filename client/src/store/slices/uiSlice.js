import { createSlice } from "@reduxjs/toolkit";
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    searchTerm: "",
    filters: {
      assignee: "",
      priority: "",
      dueDate: "",
    },
    isTaskFormOpen: false,
    selectedTask: null,
    notification: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        assignee: "",
        priority: "",
        dueDate: "",
      };
    },
    openTaskForm: (state, action) => {
      state.isTaskFormOpen = true;
      state.selectedTask = action.payload || null;
    },
    closeTaskForm: (state) => {
      state.isTaskFormOpen = false;
      state.selectedTask = null;
    },
    showNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});
export const {
  setSearchTerm,
  setFilter,
  clearFilters,
  openTaskForm,
  closeTaskForm,
  showNotification,
  clearNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
