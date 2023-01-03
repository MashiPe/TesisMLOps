import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './slices/Counter/counterSlice';
import currentExpReducer, { currentExpSlice } from './slices/CurrentExp/currentExpSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    currentExp: currentExpReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;