import { createSlice } from "@reduxjs/toolkit";
import { boostDataThunk } from "../Middlewares/boostBuyData";
import { loginTelegramBotThunk } from "../Middlewares/homePageData";

const initialState = {
  boostData: [],
  loading: false,
  isSuccess: false,
  selectedTab: ""
};

const boostSlice = createSlice({
  name: "boosts",
  initialState,
  reducers: {
    setUpdateSelectedTab(state, action) {
      state.selectedTab = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(boostDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(boostDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.boostData = action.payload;
      })
      .addCase(boostDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
      });
  }
});

export const { setUpdateSelectedTab } = boostSlice.actions;

export default boostSlice.reducer;
