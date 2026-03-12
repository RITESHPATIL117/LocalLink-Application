import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout } from '../store/authSlice';
import authService from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    ...authState,
    login,
    logout: handleLogout,
  };
};
