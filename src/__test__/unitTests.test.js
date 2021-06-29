
import seatResponse from '../__mocks__/mockedResponse';
import axiosGetSeats from 'api/axiosGetSeats';
import mockedAxios from 'axios';
import {
  getMaxSeatsNextToEachOther,
  convertSeatsToReserved,
  convertToTwoDimensonal,
  getReservedSeats,
  getUpdatedSeats
} from 'helper';

const fetchMockedSeats = async () => {
  mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: seatResponse }));
  const seats = await axiosGetSeats();
  const twoDimensonal = convertToTwoDimensonal(seats);

  return { seats, twoDimensonal };
}

const getFirstSeat = (twoDimensonal) => {
  let firstFoundSeat;

  twoDimensonal.some(row => {
    return row.some(seat => {
      if (!seat.isEmptySpace) {
        firstFoundSeat = seat;
        return true;
      } else {
        return false;
      }
    })
  })

  return firstFoundSeat;
}

test('Convert to two dimensonal array with empty spaces', async () => {
  const { twoDimensonal, seats } = await fetchMockedSeats();

  expect(twoDimensonal.length).toBe(seats.slice(-1)[0].cords.x + 1);
  twoDimensonal.forEach(row => {
    expect(row.length).toBe(row.slice(-1)[0].cords.y + 1);
  });
});

test('Get correct value for max seats available that are next to each other', async () => {
  const { twoDimensonal } = await fetchMockedSeats();

  const maxSeatsNextToEachOther = getMaxSeatsNextToEachOther(twoDimensonal);

  expect(maxSeatsNextToEachOther).toBe(3);
});

test('Get reserved seats that are next to each other', async () => {
  const { twoDimensonal } = await fetchMockedSeats();
  const seatsToReserve = getMaxSeatsNextToEachOther(twoDimensonal);
  const { updatedSeats, updatedReservations } = getReservedSeats(twoDimensonal, seatsToReserve);

  expect(updatedReservations.length).toBe(seatsToReserve);
  updatedReservations.forEach(seat => {
    expect(updatedSeats[seat.cords.x][seat.cords.y].reserved).toBe(true);
  });
});

test('Get updated seats', async () => {
  const { twoDimensonal } = await fetchMockedSeats();
  const choosenSeat = getFirstSeat(twoDimensonal);

  const updatedSeats = getUpdatedSeats(twoDimensonal, choosenSeat);

  expect(updatedSeats[choosenSeat.cords.x][choosenSeat.cords.y].reserved).toBe(!choosenSeat.reserved);
  expect(updatedSeats[choosenSeat.cords.x][choosenSeat.cords.y].reservedByMe).toBe(!choosenSeat.reservedByMe);
});

test('Get seats that user reserved converted to not reserved by him', async () => {
  const { twoDimensonal } = await fetchMockedSeats();
  const convertedSeats = convertSeatsToReserved(twoDimensonal);

  convertedSeats.forEach(row => {
    row.forEach(seat => {
      if (!seat.isEmptySpace) {
        expect(seat.reservedByMe).toBe(false);
      }
    });
  });
});