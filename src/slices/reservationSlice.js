import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservation: undefined,
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservation: (state, { payload }) => {
      state.reservation = payload
    }
  }
});

export const { setReservation } = reservationSlice.actions;

export const reservationSelector = (state) => state.reservation.reservation;

export default reservationSlice.reducer;