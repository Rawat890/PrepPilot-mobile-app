import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

export const fetchMockTests = createAsyncThunk('tests/fetchAll', async (category = 'All', { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(`/tests?category=${encodeURIComponent(category)}`);
    return data;
  } catch (err) {
    // Fallback to offline cache if network fails
    const cached = await AsyncStorage.getItem('offlineMockTests');
    if (cached) {
      return JSON.parse(cached);
    }
    return rejectWithValue(err.response?.data?.message || 'Could not load tests');
  }
});

export const generateAiTest = createAsyncThunk('tests/generateAi', async (params, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/tests/generate-ai', params);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'AI Test generation failed');
  }
});

export const fetchTestDetails = createAsyncThunk('tests/fetchOne', async (testId, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(`/tests/${testId}`);
    return data;
  } catch (err) {
    const cached = await AsyncStorage.getItem('offlineMockTests');
    if (cached) {
      const list = JSON.parse(cached);
      const found = list.find((t) => t._id === testId);
      if (found) return found;
    }
    return rejectWithValue(err.response?.data?.message || 'Failed to load test');
  }
});

export const submitExam = createAsyncThunk('tests/submit', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/tests/submit', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit exam');
  }
});

export const fetchAnalytics = createAsyncThunk('tests/analytics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/tests/analytics');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
  }
});

export const syncOfflineQuestions = createAsyncThunk('tests/syncOffline', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/tests/offline-bundle');
    await AsyncStorage.setItem('offlineMockTests', JSON.stringify(data.tests));
    await AsyncStorage.setItem('offlineLastSynced', data.syncedAt);
    return data;
  } catch (err) {
    return rejectWithValue('Offline sync requires an active internet connection');
  }
});

export const loadOfflineCache = createAsyncThunk('tests/loadOffline', async () => {
  const cached = await AsyncStorage.getItem('offlineMockTests');
  const syncedAt = await AsyncStorage.getItem('offlineLastSynced');
  return {
    tests: cached ? JSON.parse(cached) : [],
    syncedAt: syncedAt || null,
  };
});

const testSlice = createSlice({
  name: 'tests',
  initialState: {
    list: [],
    activeTest: null,
    lastResult: null,
    analytics: null,
    offlineTests: [],
    offlineSyncedAt: null,
    loading: false,
    generatingAi: false,
    syncingOffline: false,
    error: null,
  },
  reducers: {
    setActiveTestOffline: (state, action) => {
      state.activeTest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockTests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMockTests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMockTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateAiTest.pending, (state) => {
        state.generatingAi = true;
        state.error = null;
      })
      .addCase(generateAiTest.fulfilled, (state, action) => {
        state.generatingAi = false;
        state.activeTest = action.payload;
        state.list = [action.payload, ...state.list];
      })
      .addCase(generateAiTest.rejected, (state, action) => {
        state.generatingAi = false;
        state.error = action.payload;
      })
      .addCase(fetchTestDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTest = action.payload;
      })
      .addCase(fetchTestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.lastResult = action.payload;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(syncOfflineQuestions.pending, (state) => {
        state.syncingOffline = true;
      })
      .addCase(syncOfflineQuestions.fulfilled, (state, action) => {
        state.syncingOffline = false;
        state.offlineTests = action.payload.tests;
        state.offlineSyncedAt = action.payload.syncedAt;
      })
      .addCase(syncOfflineQuestions.rejected, (state) => {
        state.syncingOffline = false;
      })
      .addCase(loadOfflineCache.fulfilled, (state, action) => {
        state.offlineTests = action.payload.tests;
        state.offlineSyncedAt = action.payload.syncedAt;
      });
  },
});

export const { setActiveTestOffline } = testSlice.actions;
export default testSlice.reducer;
