import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { kanbanAPI } from "../../utils/api";
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (boardId) => {
    const response = await kanbanAPI.get(`/tasks/board/${boardId}`);
    return response.data;
  }
);
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await kanbanAPI.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await kanbanAPI.put(`/tasks/${taskData._id}`, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await kanbanAPI.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await kanbanAPI.patch(`/tasks/${taskId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    optimisticUpdates: [],
  },
  reducers: {
    optimisticUpdate: (state, action) => {
      const { taskId, updates, temporaryId } = action.payload;
      if (taskId) {
        const taskIndex = state.items.findIndex((task) => task._id === taskId);
        if (taskIndex !== -1) {
          state.items[taskIndex] = { ...state.items[taskIndex], ...updates };
        }
      } else if (temporaryId) {
        state.items.push({ ...updates, _id: temporaryId, isOptimistic: true });
      }
      state.optimisticUpdates.push({
        taskId: taskId || temporaryId,
        updates,
        timestamp: Date.now(),
      });
    },
    revertOptimisticUpdate: (state, action) => {
      const { taskId } = action.payload;
      state.optimisticUpdates = state.optimisticUpdates.filter(
        (update) => update.taskId !== taskId
      );
      state.items = state.items.filter(
        (task) => !task.isOptimistic || task._id !== taskId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const optimisticIndex = state.items.findIndex(
          (task) => task.isOptimistic && task.title === action.payload.title
        );
        if (optimisticIndex !== -1) {
          state.items[optimisticIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        const temporaryId = action.meta.arg.temporaryId;
        state.items = state.items.filter((task) => task._id !== temporaryId);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});
export const { optimisticUpdate, revertOptimisticUpdate } = tasksSlice.actions;
export default tasksSlice.reducer;
