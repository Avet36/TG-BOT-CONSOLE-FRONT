import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks } from "../../Commons/Services/taskService";

export const getTaskDataThunk = createAsyncThunk(
  "get/task/data",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getTasks(token);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Something went wrong");
    }
  }
);
