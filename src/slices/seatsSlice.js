import { createSlice } from "@reduxjs/toolkit";
import { axiosGetSeats } from "api";
import { convertToTwoDimensonal } from "helper";

const initialState = {
  prevSeats: [],
  prevSeatsAvailable: 0,

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
      state.seatsAvailable = payload.updatedSeatsAvailable ? payload.updatedSeatsAvailable : state.seatsAvailable
    },
    setPrevSeats: (state) => {
      state.prevSeats = state.seats
      state.prevSeatsAvailable = state.seatsAvailable
    },
    restoreSeats: (state) => {
      state.seats = state.prevSeats
      state.seatsAvailable = state.prevSeatsAvailable
    }
  }
});

export const { getSeats, getSeatsSuccess, getSeatsFailure, updateSeats, setPrevSeats, restoreSeats } = seatsSlice.actions;

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