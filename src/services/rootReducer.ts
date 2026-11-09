import { combineSlices } from '@reduxjs/toolkit';

import constructorSlice from './slices/constructorSlice';
import ingredientsSlice from './slices/ingredientsSlice';
import orderSlice from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedSlice from './slices/feedSlice';

export const rootReducer = combineSlices({
  ingredients: ingredientsSlice,
  user: userReducer,
  order: orderSlice,
  constructorBurger: constructorSlice,
  feed: feedSlice,
});