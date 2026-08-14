import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../app/api';

const storedToken = localStorage.getItem('token');

// ---- Thunks ----

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/register', { username, email, password });
      if (!data.success) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }
      toast.success('Account created!');
      return data; // { token, user }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      if (!data.success) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }
      toast.success('Welcome back!');
      return data; // { token, user }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Loads the logged-in user's profile using the stored token (runs on app load)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (!data.success) return rejectWithValue(data.message);
      return data.user;
    } catch (error) {
      // Invalid/expired token -- fail silently, just log the user out
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Reads live hotel-registration status (derived server-side from Hotel.isVerified)
export const fetchHotelStatus = createAsyncThunk(
  'auth/fetchHotelStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/user');
      if (!data.success) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }
      return data; // { role, recentSearchedCities, hotelStatus }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const storeRecentSearchedCity = createAsyncThunk(
  'auth/storeRecentSearchedCity',
  async (city, { rejectWithValue }) => {
    try {
      await api.post('/api/user/recent-search', { recentSearchedCity: city });
      return city;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  user: null,
  token: storedToken || null,
  authLoading: true,
  isOwner: false,
  isAdmin: false,
  hotelRegStatus: 'none',
  searchedCities: [],
};

const applyUser = (state, user) => {
  state.user = user;
  state.isOwner = user.role === 'hotelOwner';
  state.isAdmin = user.role === 'admin';
  if (user.recentSearchedCities) state.searchedCities = user.recentSearchedCities;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isOwner = false;
      state.isAdmin = false;
      state.hotelRegStatus = 'none';
      localStorage.removeItem('token');
    },
    setHotelRegStatus(state, action) {
      state.hotelRegStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        applyUser(state, action.payload.user);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        applyUser(state, action.payload.user);
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        applyUser(state, action.payload);
        state.authLoading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        state.authLoading = false;
      })
      .addCase(fetchHotelStatus.fulfilled, (state, action) => {
        state.hotelRegStatus = action.payload.hotelStatus || 'none';
        if (action.payload.recentSearchedCities) {
          state.searchedCities = action.payload.recentSearchedCities;
        }
      })
      .addCase(storeRecentSearchedCity.fulfilled, (state, action) => {
        const updated = [...state.searchedCities, action.payload];
        if (updated.length > 3) updated.shift();
        state.searchedCities = updated;
      });
  },
});

export const { logout, setHotelRegStatus } = authSlice.actions;
export default authSlice.reducer;