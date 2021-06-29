import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservation: [],
  isComplete: false
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    completeReservation: (state, { payload }) => {
      state.reservation = payload
      state.isComplete = true
    },
    clearReservation: (state) => {
      state.reservation = []
      state.isComplete = false
    }
  }
});

export const { completeReservation, clearReservation } = reservationSlice.actions;

export const reservationSelector = (state) => state.reservation;

export default reservationSlice.reducer;