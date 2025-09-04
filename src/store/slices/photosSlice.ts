import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '@services/api';
import { LoggerService } from '@services/LoggerService';
import { PhotosModel } from '../../types/PhotosModel';

interface PhotosState {
  photos: PhotosModel[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PhotosState = {
  photos: [],
  loading: false,
  error: null,
};

// Async thunk for fetching photos
export const fetchPhotos = createAsyncThunk<
  PhotosModel[], // ✅ Return type of fulfilled action
  void, // ✅ Argument type (no arguments passed)
  { rejectValue: string } // ✅ ThunkAPI configuration for rejected case
>('users/fetchPhotos', async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get<PhotosModel[]>('/users');

    LoggerService.log({
      method: 'GET',
      url: '/users',
      status: res.status,
      response: res.data,
      time: new Date().toISOString(),
      params: { page: 1 },
      message: '',
    });

    return res.data;
  } catch (error: any) {
    LoggerService.log({
      method: 'GET',
      url: '/users',
      status: error?.response?.status || 'N/A',
      time: new Date().toISOString(),
      params: { page: 1 },
      error: error.message,
      message: '',
    });

    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch posts');
  }
});

// Slice
const photosSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPhotos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPhotos.fulfilled,
        (state, action: PayloadAction<PhotosModel[]>) => {
          state.loading = false;
          state.photos = action.payload;
        },
      )
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export default photosSlice.reducer;
