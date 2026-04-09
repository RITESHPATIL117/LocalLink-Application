import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      if (token && userData) {
        return { token, user: JSON.parse(userData) };
      }
      return rejectWithValue('No token found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Pass role as third argument to authService
      const response = await authService.login(credentials.email, credentials.password, credentials.role);
      // Assuming response has { token, user }
      const data = response.data || response;
      const { token, refreshToken, user } = data;
      await AsyncStorage.setItem('token', token);
      if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      return { token, refreshToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      const data = response.data || response;
      const { token, refreshToken, user } = data;
      await AsyncStorage.setItem('token', token);
      if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      return { token, refreshToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const initialState = {
  token: null,
  isAuthenticated: false,
  role: null, // 'customer', 'provider', 'admin'
  user: null,
  loading: true, // Initially true while checking auth status
  error: null,
  leadCaptured: false,
  temporaryLeadInfo: null, // { name, phone }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.role = user?.role || 'customer';
      state.isAuthenticated = !!token;
      state.loading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.leadCaptured = false;
      state.temporaryLeadInfo = null;
    },
    setLeadCaptured: (state, action) => {
      state.leadCaptured = true;
      state.temporaryLeadInfo = action.payload; // { name, phone }
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuthStatus
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role || 'customer';
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role || 'customer';
        state.isAuthenticated = true;
        state.loading = false;
        console.log(`[AUTH SUCCESS] Token synchronized for ${state.user.email}`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error(`[AUTH FAILED] ${action.payload}`);
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role || 'customer';
        state.isAuthenticated = true;
        state.loading = false;
        console.log(`[AUTH SUCCESS] Registration complete. Token synchronized.`);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const logout = () => async (dispatch) => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('userData');
  dispatch(authSlice.actions.clearCredentials());
};

export const { setCredentials, clearCredentials, setLeadCaptured } = authSlice.actions;
export default authSlice.reducer;
