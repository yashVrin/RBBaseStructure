import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@services/api';
import { LoggerService } from '@services/LoggerService';
import type { PostModel } from '../../types/PostModel'; // <-- Update this path if needed

// Define the shape of the slice state
interface PostsState {
  posts: PostModel[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

// Thunk to fetch posts
export const fetchPosts = createAsyncThunk<
  PostModel[], // ✅ return type of success
  void, // ✅ argument type (no args)
  { rejectValue: string } // ✅ thunkAPI config
>('posts/fetchPosts', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get<PostModel[]>('/posts');

    LoggerService.log({
      method: 'GET',
      url: '/posts',
      status: res.status,
      response: res.data,
      message: '',
    });

    return res.data;
  } catch (error: any) {
    LoggerService.log({
      method: 'GET',
      url: '/posts',
      status: error?.response?.status || 'N/A',
      error: error.message,
      message: '',
    });

    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch posts');
  }
});

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<PostModel[]>) => {
          state.loading = false;
          state.posts = action.payload;
        },
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export default postsSlice.reducer;
