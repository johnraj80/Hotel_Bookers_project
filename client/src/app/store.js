import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import roomsReducer from '../features/rooms/roomsSlice';
import adminReducer from '../features/admin/adminSlice';
import themeReducer from '../features/theme/themeSlice';
import api from './api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    rooms: roomsReducer,
    admin: adminReducer,
    theme: themeReducer,
  },
});

// Attached here (not inside api.js) to avoid a circular import between
// store.js and api.js -- by this point `store` is fully initialized.
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default store;