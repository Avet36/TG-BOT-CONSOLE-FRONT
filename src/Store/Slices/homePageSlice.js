import { createSlice } from "@reduxjs/toolkit";
import {
  getHomePageDataThunk,
  sendDailyCodeThunk,
  sendDailyPointThunk
} from "../Middlewares/homePageData";

const initialState = {
  homeData: null,
  loading: false,
  showSuccess: false
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setCloseSuccess: (state) => {
      state.showSuccess = false;
    },
    setUpdateHomeData: (state, action) => {
      const { user_mining_data, total_balance, mining_claim_points } =
        action.payload || {};

      if (state.homeData) {
        if (typeof user_mining_data !== "undefined") {
          state.homeData.user_mining_data = user_mining_data;
        }

        if (typeof total_balance !== "undefined") {
          state.homeData.total_balance = total_balance;
        }
      }

      if (typeof mining_claim_points !== "undefined") {
        state.showSuccess = mining_claim_points;
      }
    },

    setUpdateUbgradeData: (state, action) => {
      if (state.homeData.booster.upgrades) {
        state.homeData.booster.upgrades = action.payload?.upgrades;
        state.homeData.total_balance = action.payload?.total_balance;
        state.homeData.user_mining_data = action.payload?.user_mining_data;
      }
    },

    setUpdateboostData: (state, action) => {
      if (state.homeData.booster.boosts) {
        state.homeData.booster.boosts = action.payload?.boosts;
      }
    },

    setUpdateboostDataDeactivate: (state, action) => {
      if (state.homeData.booster.boosts && action.payload.boosts) {
        state.homeData.booster.boosts = action.payload.boosts;
      }
    },

    setUpdateBotData: (state, action) => {
      if (state.homeData.booster.bot && action.payload) {
        state.homeData.booster.bot = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHomePageDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHomePageDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.homeData = action.payload;
        state.showSuccess = action.payload?.initial_point;
      })
      .addCase(getHomePageDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // daily code
      .addCase(sendDailyCodeThunk.fulfilled, (state, action) => {
        state.showSuccess = action.payload?.dailyCodePoint;
        if (
          state.homeData &&
          state.homeData.total_balance !== null &&
          action.payload?.totalBalance
        ) {
          state.homeData.is_used_daily_code = true;
          state.homeData.total_balance = action.payload?.totalBalance;
        }
      })

      .addCase(sendDailyCodeThunk.rejected, (state, action) => {
        state.showSuccess = false;
      })

      // daily point
      .addCase(sendDailyPointThunk.fulfilled, (state, action) => {
        state.showSuccess = action.payload;
        if (
          state.homeData &&
          state.homeData.total_balance !== null &&
          action.payload?.totalBalance
        ) {
          state.homeData.total_balance = action.payload?.totalBalance;
          state.homeData.is_used_daily_claim = true;
        }
      })

      .addCase(sendDailyPointThunk.rejected, (state, action) => {
        state.showSuccess = false;
      });
  }
});

export const {
  setCloseSuccess,
  setUpdateHomeData,
  setUpdateUbgradeData,
  setUpdateboostData,
  setUpdateboostDataDeactivate,
  setUpdateBotData
} = homePageSlice.actions;

export default homePageSlice.reducer;
