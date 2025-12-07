import { createAsyncThunk } from '@reduxjs/toolkit';
import { buyTon } from '../../Commons/Services/buyTonService';

export const boostDataThunk = createAsyncThunk(
  'post/ton',
  async ({ data, token }) => {
    try {
      const response = await buyTon(data, token);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);
