import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservation: [],
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
    }
  }
});

export const { setReservation, clearReservation } = reservationSlice.actions;

export const reservationSelector = (state) => state.reservation;

export default reservationSlice.reducer;