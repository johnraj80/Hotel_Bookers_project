import axios from 'axios';

// A single configured axios instance used everywhere instead of context.
// NOTE: this file intentionally does NOT import the store -- doing so
// creates a circular import (store -> authSlice -> api -> store) that
// throws "Cannot access 'authReducer' before initialization" at startup.
// The auth token is attached via an interceptor set up in store.js instead,
// after the store has finished initializing.
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default api;