import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reservationReducer from './reservationSlice';
import seatsReducer from './seatsSlice';

const rootReducer = combineReducers({
  reservation: reservationReducer,
  seats: seatsReducer
})

export const store = configureStore({
  reducer: rootReducer
});
