import { configureStore } from "@reduxjs/toolkit";
import boardsSlice from "./slices/boardsSlice";
import tasksSlice from "./slices/tasksSlice";
import uiSlice from "./slices/uiSlice";
export const store = configureStore({
  reducer: {
    boards: boardsSlice,
    tasks: tasksSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
