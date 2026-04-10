'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { checkAuthStatus } from './authSlice';

export default function StoreProvider({ children }) {
  useEffect(() => {
    store.dispatch(checkAuthStatus());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
