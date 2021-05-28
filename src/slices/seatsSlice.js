import { createSlice } from "@reduxjs/toolkit";
import { axiosGetSeats } from "api";
import { convertToTwoDimensonal } from "helper";

const initialState = {
  seats: [],
  seatsAvailable: 0,
  state: 'idle',
};

const seatsSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    getSeats: (state) => {
      state.state = 'loading'
    },
    getSeatsSuccess: (state, { payload }) => {
      state.seats = payload.seats
      state.seatsAvailable = payload.seatsAvailable
      state.state = 'loaded'
    },
    getSeatsFailure: (state) => {
      state.state = 'error'
    },
    updateSeats: (state, { payload }) => {
      state.seats = payload.updatedSeats
      state.seatsAvailable = payload.updatedSeatsAvailable
    },
  }
});

export const { getSeats, getSeatsSuccess, getSeatsFailure, updateSeats } = seatsSlice.actions;

export const seatsSelector = (state) => state.seats;

export default seatsSlice.reducer;

export function fetchSeats() {
  return async (dispatch) => {
    dispatch(getSeats())
    await axiosGetSeats()
      .then(res => {
        dispatch(getSeatsSuccess({
          seats: convertToTwoDimensonal(res),
          seatsAvailable: res.filter((seat) => !seat.reserved).length
        }))
      })
      .catch(e => {
        dispatch(getSeatsFailure())
        console.log(e)
      })
  }
}