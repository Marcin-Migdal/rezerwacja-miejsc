import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservation: [],
  isComplete: false
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservation: (state, { payload }) => {
      state.reservation = payload
    },
    clearReservation: (state) => {
      state.reservation = []
      state.isComplete = false
    },
    completeReservation: (state) => {
      state.isComplete = true
    }
  }
});

export const { setReservation, clearReservation, completeReservation } = reservationSlice.actions;

export const reservationSelector = (state) => state.reservation;

export default reservationSlice.reducer;