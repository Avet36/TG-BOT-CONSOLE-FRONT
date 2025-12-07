import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks } from "../../Commons/Services/taskService";
import { getRefferals } from "./../../Commons/Services/userRefferalsService";

export const getUserRefferalsDataThunk = createAsyncThunk(
  "get/userRefferals/data",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getRefferals(token);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Something went wrong");
    }
  }
);
