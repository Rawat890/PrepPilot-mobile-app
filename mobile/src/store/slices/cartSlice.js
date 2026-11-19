import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchStorePacks = createAsyncThunk('cart/fetchPacks', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/store/packs');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch test packs');
  }
});

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/store/cart');
    return data.items || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addItemToCart = createAsyncThunk('cart/add', async (testPackId, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/store/cart', { testPackId });
    return data.items || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const removeItemFromCart = createAsyncThunk('cart/remove', async (packId, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.delete(`/store/cart/${packId}`);
    return data.items || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
  }
});

export const checkoutCart = createAsyncThunk('cart/checkout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/store/checkout');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Checkout failed');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    packs: [],
    items: [],
    loading: false,
    checkoutMessage: null,
  },
  reducers: {
    clearCheckoutMessage: (state) => {
      state.checkoutMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorePacks.fulfilled, (state, action) => {
        state.packs = action.payload;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.items = [];
        state.checkoutMessage = action.payload.message;
      });
  },
});

export const { clearCheckoutMessage } = cartSlice.actions;
export default cartSlice.reducer;
