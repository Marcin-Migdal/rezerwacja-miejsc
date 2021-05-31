

import seatResponse from '../__mocks__/mockedResponse';
import axiosGetSeats from 'api/axiosGetSeats';
import mockedAxios from 'axios';
import { convertToTwoDimensonal, getMaxSeatsNextToEachOther } from 'helper';
import seatsReducer, {
  getSeats,
  getSeatsSuccess,
  getSeatsFailure,
  editSeats,
  updateSeats,
  setPrevSeats,
  restoreSeats
} from '../slices/seatsSlice';

describe('seats reducer', () => {
  const initialState = {
    prevSeats: [],
    prevSeatsAvailable: 0,

    seats: [],
    seatsAvailable: 0,
    maxSeatsNextToEachOther: 0,
    state: 'idle',
  };

  const fetchMockedSeats = async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: seatResponse }));
    const seats = await axiosGetSeats();
    const twoDimensonalSeats = convertToTwoDimensonal(seats);
    const seatsAvailable = seats.filter((seat) => !seat.reserved).length;

    return { twoDimensonalSeats, seatsAvailable };
  }

  it('should handle initial state', () => {
    expect(seatsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle getSeats', () => {
    const actual = seatsReducer(initialState, getSeats());
    expect(actual.state).toBe('loading');
  });

  it('should handle getSeatsSuccess', async () => {
    const { twoDimensonalSeats, seatsAvailable } = await fetchMockedSeats();

    const payload = {
      seats: twoDimensonalSeats,
      seatsAvailable: seatsAvailable,
      maxSeatsNextToEachOther: getMaxSeatsNextToEachOther(twoDimensonalSeats)
    };

    const actual = seatsReducer(initialState, getSeatsSuccess(payload));

    expect(actual.seats).toBe(payload.seats);
    expect(actual.seatsAvailable).toBe(payload.seatsAvailable);
    expect(actual.maxSeatsNextToEachOther).toBe(payload.maxSeatsNextToEachOther);
  });

  it('should handle getSeatsFailure', () => {
    const actual = seatsReducer(initialState, getSeatsFailure());
    expect(actual.state).toBe('error');
  });

  it('should handle editSeats', async () => {
    const { twoDimensonalSeats } = await fetchMockedSeats();
    const actual = seatsReducer(initialState, editSeats(twoDimensonalSeats));
    expect(actual.seats).toBe(twoDimensonalSeats);
  });

  it('should handle updateSeats', async () => {
    const { twoDimensonalSeats, seatsAvailable } = await fetchMockedSeats();
    const payload = {
      updatedSeats: twoDimensonalSeats,
      updatedSeatsAvailable: seatsAvailable,
      maxSeatsNextToEachOther: getMaxSeatsNextToEachOther(twoDimensonalSeats)
    };

    const actual = seatsReducer(initialState, updateSeats(payload));

    expect(actual.seats).toBe(payload.updatedSeats);
    expect(actual.seatsAvailable).toBe(payload.updatedSeatsAvailable);
    expect(actual.maxSeatsNextToEachOther).toBe(payload.maxSeatsNextToEachOther);
  });

  it('should handle setPrevSeats', async () => {
    const { twoDimensonalSeats, seatsAvailable } = await fetchMockedSeats();
    const payload = {
      seats: twoDimensonalSeats,
      seatsAvailable: seatsAvailable,
    };

    const actual = seatsReducer(initialState, setPrevSeats(payload));

    expect(actual.prevSeats).toBe(payload.seats);
    expect(actual.prevSeatsAvailable).toBe(payload.seatsAvailable);
  });

  it('should handle restoreSeats', async () => {
    const { twoDimensonalSeats, seatsAvailable } = await fetchMockedSeats();
    const payload = {
      seats: twoDimensonalSeats,
      seatsAvailable: seatsAvailable,
    };

    const stateBeforeRestore = seatsReducer(initialState, setPrevSeats(payload));
    const actual = seatsReducer(stateBeforeRestore, restoreSeats());

    expect(actual.seats).toBe(stateBeforeRestore.prevSeats);
    expect(actual.seatsAvailable).toBe(stateBeforeRestore.prevSeatsAvailable);
  });
});