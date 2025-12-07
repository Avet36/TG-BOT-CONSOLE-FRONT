import { createSlice } from "@reduxjs/toolkit";
import { boostDataThunk } from "../Middlewares/boostBuyData";
import { loginTelegramBotThunk } from "../Middlewares/homePageData";
import { getTaskDataThunk } from "../Middlewares/taskDataMidlware";

const initialState = {
  taskData: null,
  loading: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    updateStartTask(state, action) {
      const newTaskObj = action.payload;

      if (!Array.isArray(state.taskData.completed)) {
        state.taskData.completed = [];
      }
      if (!Array.isArray(state.taskData.new)) {
        state.taskData.new = [];
      }

      const updatedTasks = state.taskData.new.filter((item) => {
        if (item.id === newTaskObj?.task_id) {
          if (newTaskObj.status === "completed") {
            state.taskData.completed.unshift({ ...item });
            return false;
          } else {
            item.status = newTaskObj.status;
          }
        }
        return item; // Keep item in new
      });

      state.taskData.new = updatedTasks;
    },
    setUpdateSingleTask(state, action) {
      const { id } = action.payload;

      if (!Array.isArray(state.taskData?.new)) return;

      const task = state.taskData.new.find((item) => item.id === id);
      if (task) {
        task.status = "start";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTaskDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.taskData = action.payload;
      })
      .addCase(getTaskDataThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { updateStartTask, setUpdateSingleTask } = taskSlice.actions;

export default taskSlice.reducer;
