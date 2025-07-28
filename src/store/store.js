// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import photosReducer from './slices/photosSlice';

// ✅ combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  photos: photosReducer,
});

// ✅ redux-persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // ✅ only persist auth slice
};

// ✅ wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 🔧 Required for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
