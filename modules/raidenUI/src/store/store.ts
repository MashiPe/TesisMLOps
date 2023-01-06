import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './slices/Counter/counterSlice';
import experimentsReducer from './slices/ExperimentsSlice';
import currentExpReducer, { currentExpSlice } from './slices/CurrentExp/currentExpSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    currentExp: currentExpReducer,
    experiments: experimentsReducer,
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