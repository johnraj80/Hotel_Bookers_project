import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showAuthModal: false,
    authView: 'login', // 'login' | 'signup'
    showHotelReg: false,
  },
  reducers: {
    openSignIn(state) {
      state.authView = 'login';
      state.showAuthModal = true;
    },
    openSignUp(state) {
      state.authView = 'signup';
      state.showAuthModal = true;
    },
    closeAuthModal(state) {
      state.showAuthModal = false;
    },
    setAuthView(state, action) {
      state.authView = action.payload;
    },
    setShowHotelReg(state, action) {
      state.showHotelReg = action.payload;
    },
  },
});

export const { openSignIn, openSignUp, closeAuthModal, setAuthView, setShowHotelReg } = uiSlice.actions;
export default uiSlice.reducer;