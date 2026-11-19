import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchBookmarks = createAsyncThunk('bookmarks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/bookmarks');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookmarks');
  }
});

export const toggleBookmark = createAsyncThunk('bookmarks/toggle', async ({ questionId, note }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/bookmarks/toggle', { questionId, note });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle bookmark');
  }
});

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state) => {
        state.loading = false;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        if (action.payload.bookmarked) {
          state.items = [action.payload.bookmark, ...state.items];
        } else {
          state.items = state.items.filter(
            (b) => String(b.question?._id || b.question) !== String(action.payload.questionId)
          );
        }
      });
  },
});

export default bookmarkSlice.reducer;
