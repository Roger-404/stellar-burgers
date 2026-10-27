import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import type { TFeedState, TOrder } from '../../utils/types';

type TFeedOrderState = TFeedState & {
  selectedOrder: TOrder | null;
  error: Error | null
}

const initialState: TFeedOrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  selectedOrder: null,
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetch',
  async () => await getFeedsApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => {
    return await getOrderByNumberApi(number);
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = new Error(action.error.message ?? 'Ошибка загрузки ленты');
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.orders[0] ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = new Error(action.error.message ?? 'Ошибка загрузки заказа');
      });
  },
});

export const { clearSelectedOrder } = feedSlice.actions;

export const selectFeedOrders = (state: { feed: TFeedOrderState }): TOrder[] =>
  state.feed.orders;

export const selectFeedTotal = (state: { feed: TFeedOrderState }): number => state.feed.total;

export const selectFeedTotalToday = (state: { feed: TFeedOrderState }): number =>
  state.feed.totalToday;

export const selectFeedLoading = (state: { feed: TFeedOrderState }): boolean =>
  state.feed.isLoading;

export const selectFeedError = (state: { feed: TFeedOrderState }): Error | null =>
  state.feed.error;

export const selectSelectedOrder = (state: { feed: TFeedOrderState }): TOrder | null =>
  state.feed.selectedOrder;

export default feedSlice.reducer;