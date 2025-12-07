import { createSlice } from '@reduxjs/toolkit';
import { loginTelegramBotThunk } from '../Middlewares/homePageData';

const initialState = {
  loading: false,
  isSuccess: false,
  token: null,
};

const telegramLoginSLice = createSlice({
  name: 'telegramLogin',
  initialState,
  reducers: {
    resetIsSuccess(state, action) {
      state.isSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTelegramBotThunk.pending, (state) => {
        state.isSuccess = false;
      })
      .addCase(loginTelegramBotThunk.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.token = action.payload?.accessToken;
      })
      .addCase(loginTelegramBotThunk.rejected, (state, action) => {
        state.isSuccess = false;
      });
  },
});

export const { resetIsSuccess } = telegramLoginSLice.actions;

export default telegramLoginSLice.reducer;
