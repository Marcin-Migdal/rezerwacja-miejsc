
import reservationReducer, {
  setReservation,
  clearReservation,
  completeReservation,
} from '../slices/reservationSlice';

describe('reservation reducer', () => {
  const initialState = {
    reservation: [],
    isComplete: false
  };

  const reservation = [{
    "id": "s02",
    "cords": {
      "x": 0,
      "y": 2
    },
    "reserved": false
  }];

  const completedState = {
    reservation: reservation,
    isComplete: true
  };


  it('should handle initial state', () => {
    expect(reservationReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setReservation', () => {
    const actual = reservationReducer(initialState, setReservation(reservation));
    expect(actual.reservation.length).toEqual(reservation.length);
  });

  it('should handle completeReservation', () => {
    const actual = reservationReducer(initialState, completeReservation());
    expect(actual.isComplete).toEqual(true);
  });

  it('should handle clearReservation', () => {
    const actual = reservationReducer(completedState, clearReservation());
    expect(actual.reservation.length).toEqual(0);
    expect(actual.isComplete).toEqual(false);
  });
});