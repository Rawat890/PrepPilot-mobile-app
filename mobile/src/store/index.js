import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import testReducer from './slices/testSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tests: testReducer,
    bookmarks: bookmarkReducer,
    cart: cartReducer,
  },
});
