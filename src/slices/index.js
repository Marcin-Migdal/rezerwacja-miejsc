import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './reservationSlice';

export const store = configureStore({
  reducer: {
    reservation: counterReducer,
  },
});
