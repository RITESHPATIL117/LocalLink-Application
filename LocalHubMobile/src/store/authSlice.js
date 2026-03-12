import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: 'dummy-token',
  isAuthenticated: true,
  role: 'customer', // 'customer', 'provider', or 'admin'
  user: { name: 'Demo User', email: 'demo@justdial.clone' },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.role = user?.role || null;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
