import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { kanbanAPI } from "../../utils/api";
export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await kanbanAPI.get("/boards");
      console.log("📋 Boards fetched:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching boards:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (boardData, { rejectWithValue }) => {
    try {
      const response = await kanbanAPI.post("/boards", boardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const boardsSlice = createSlice({
  name: "boards",
  initialState: {
    items: [],
    currentBoard: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        if (!state.currentBoard && action.payload.length > 0) {
          state.currentBoard = action.payload[0];
        }
        state.error = null;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("❌ Boards fetch failed:", action.payload);
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.items.push(action.payload);
        if (!state.currentBoard) {
          state.currentBoard = action.payload;
        }
      });
  },
});
export const { setCurrentBoard, clearError } = boardsSlice.actions;
export default boardsSlice.reducer;
