import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../app/api';

const handle = (message) => {
  toast.error(message);
  return message;
};

export const fetchDashStats = createAsyncThunk(
  'admin/fetchDashStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/admin/dashboard');
      if (!data.success) return rejectWithValue(handle(data.message));
      return data.stats;
    } catch (error) {
      return rejectWithValue(handle(error.response?.data?.message || error.message));
    }
  }
);

export const fetchRegisteredHotels = createAsyncThunk(
  'admin/fetchRegisteredHotels',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/admin/hotels/registered');
      if (!data.success) return rejectWithValue(handle(data.message));
      return data.hotels;
    } catch (error) {
      return rejectWithValue(handle(error.response?.data?.message || error.message));
    }
  }
);

export const fetchPendingHotels = createAsyncThunk(
  'admin/fetchPendingHotels',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/admin/hotels/pending');
      if (!data.success) return rejectWithValue(handle(data.message));
      return data.pendingHotels;
    } catch (error) {
      return rejectWithValue(handle(error.response?.data?.message || error.message));
    }
  }
);

// action: 'approve' | 'reject'
export const verifyHotel = createAsyncThunk(
  'admin/verifyHotel',
  async ({ hotelId, action }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/admin/hotels/verify', { hotelId, action });
      if (!data.success) return rejectWithValue(handle(data.message));
      toast.success(`Hotel ${action === 'approve' ? 'Approved' : 'Rejected'} Successfully`);
      dispatch(fetchDashStats());
      return { hotelId };
    } catch (error) {
      return rejectWithValue(handle(error.response?.data?.message || error.message));
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'admin/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/admin/transactions');
      if (!data.success) return rejectWithValue(handle(data.message));
      return data.transactions;
    } catch (error) {
      return rejectWithValue(handle(error.response?.data?.message || error.message));
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'admin/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/admin/users');
      if (!data.success) return rejectWithValue(handle(data.message));
      return data.stats;
    } catch (error) {
      return rejectWithValue(handle(error.response?.data?.message || error.message));
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashStats: null,
    registeredHotels: null,
    pendingHotels: [],
    transactions: [],
    userStats: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashStats.fulfilled, (state, action) => { state.dashStats = action.payload; })
      .addCase(fetchRegisteredHotels.fulfilled, (state, action) => { state.registeredHotels = action.payload; })
      .addCase(fetchPendingHotels.fulfilled, (state, action) => { state.pendingHotels = action.payload; })
      .addCase(verifyHotel.fulfilled, (state, action) => {
        state.pendingHotels = state.pendingHotels.filter((h) => h._id !== action.payload.hotelId);
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => { state.transactions = action.payload; })
      .addCase(fetchUserStats.fulfilled, (state, action) => { state.userStats = action.payload; });
  },
});

export default adminSlice.reducer;