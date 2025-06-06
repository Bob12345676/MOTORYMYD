import { configureStore } from '@reduxjs/toolkit';
import { motorReducer } from './slices/motorSlice';
import { authReducer } from './slices/authSlice';
import { uiReducer } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    motors: motorReducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 