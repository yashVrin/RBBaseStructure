import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PostModel from '@types/common/models/PostModel.js';
import axiosClient from '@services/api.js';
import { LoggerService } from '@services/LoggerService.js';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get('/posts');

      // ✅ Log success
      LoggerService.log({
        method: 'GET',
        url: '/posts',
        status: res.status,
        response: res.data,
      });

      return res.data;
    } catch (error) {
      // ✅ Log error
      LoggerService.log({
        method: 'GET',
        url: '/posts',
        status: error.response?.status || 'N/A',
        error: error.message,
      });

      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch posts');
    }
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    /** @type {Post[]} */
    posts: [PostModel], // use as shape reference
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
