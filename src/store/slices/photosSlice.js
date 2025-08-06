import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '@services/api.js';
import { LoggerService } from '@services/LoggerService.js';
import PhotosModel from '@types/common/models/PhotosModel.js';

export const fetchPhotos = createAsyncThunk(
  'users/fetchPhotos',
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get('/users');

      // ✅ Log success
      LoggerService.log({
        method: 'GET',
        url: '/users',
        status: res.status,
        response: res.data,
        time: new Date().toISOString(),
        params: { page: 1 },
      });

      return res.data;
    } catch (error) {
      // ✅ Log error
      LoggerService.log({
        method: 'GET',
        url: '/users',
        status: error.response?.status || 'N/A',
        time: new Date().toISOString(),
        params: { page: 1 },
        error: error.message,
      });

      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch posts');
    }
  },
);

const photosSlice = createSlice({
  name: 'users',
  initialState: {
    /** @type {Photos[]} */
    photos: [PhotosModel], // use as shape reference
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPhotos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default photosSlice.reducer;
