import { createSlice } from '@reduxjs/toolkit';
import { getUserRefferalsDataThunk } from '../Middlewares/userRefferalsMiddleware';

const initialState = {
  referalsData: null,
  loading: false,
};

const userRefferalSlice = createSlice({
  name: 'refferals',
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserRefferalsDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserRefferalsDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.referalsData = action.payload;
      })
      .addCase(getUserRefferalsDataThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {  } = userRefferalSlice.actions;

export default userRefferalSlice.reducer;
