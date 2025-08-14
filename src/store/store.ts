import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import photosReducer from './slices/photosSlice';

// ✅ Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  photos: photosReducer,
});

// ✅ Redux-persist config
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

// ✅ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 🔧 Required for redux-persist
    }),
});

// ✅ Define RootState and AppDispatch types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// ✅ Export persistor
export const persistor = persistStore(store);
export default store;
