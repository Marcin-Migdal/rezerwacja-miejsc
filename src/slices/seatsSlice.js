import { createSlice } from "@reduxjs/toolkit";
import axiosGetSeats from "api/axiosGetSeats";
import { convertToTwoDimensonal, getMaxSeatsNextToEachOther } from "helper";

const initialState = {
  seats: [],
  seatsAvailable: 0,
  maxSeatsNextToEachOther: 0,
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
      state.maxSeatsNextToEachOther = payload.maxSeatsNextToEachOther
      state.state = 'loaded'
    },
    getSeatsFailure: (state) => {
      state.state = 'error'
    },
    editSeats: (state, { payload }) => {
      state.seats = payload
    },
    updateSeats: (state, { payload }) => {
      state.seats = payload.updatedSeats
      state.seatsAvailable = payload.updatedSeatsAvailable
      state.maxSeatsNextToEachOther = getMaxSeatsNextToEachOther(state.seats)
    },
  }
});

export const {
  getSeats,
  getSeatsSuccess,
  getSeatsFailure,
  editSeats,
  updateSeats,
} = seatsSlice.actions;

export const seatsSelector = (state) => state.seats;

export default seatsSlice.reducer;

export function fetchSeats() {
  return async (dispatch) => {
    dispatch(getSeats())
    await axiosGetSeats()
      .then(res => {
        const twoDimensonalSeats = convertToTwoDimensonal(res);
        dispatch(getSeatsSuccess({
          seats: twoDimensonalSeats,
          seatsAvailable: res.filter((seat) => !seat.reserved).length,
          maxSeatsNextToEachOther: getMaxSeatsNextToEachOther(twoDimensonalSeats)
        }))
      })
      .catch(e => {
        dispatch(getSeatsFailure())
        console.log(e)
      })
  }
}