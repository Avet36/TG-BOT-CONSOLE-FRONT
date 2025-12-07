import { createAsyncThunk } from "@reduxjs/toolkit";
import { boostData } from "../../Commons/Services/boostService";

export const boostDataThunk = createAsyncThunk(
  "post/boosts",
  async ({ token }) => {
    try {
      const response = await boostData(token);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);
