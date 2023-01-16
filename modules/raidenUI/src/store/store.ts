import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './slices/Counter/counterSlice';
import experimentsReducer from './slices/ExperimentsSlice';
import currentExpReducer, { currentExpSlice } from './slices/CurrentExp/currentExpSlice';
import opdefinitionsReducer from "./slices/OperatorDefinitionSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    currentExp: currentExpReducer,
    experiments: experimentsReducer,
    opdefinitions: opdefinitionsReducer 
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

export const globalState = store.getState();