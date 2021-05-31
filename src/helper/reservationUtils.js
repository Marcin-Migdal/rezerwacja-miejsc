import produce from "immer";

export const getUpdatedSeats = (seats, choosenSeat) => {
  const { cords } = choosenSeat;

  const updatedSeats = produce(seats, (draft) => {
    draft[cords.x][cords.y].reserved = !draft[cords.x][cords.y].reserved;
    draft[cords.x][cords.y].reservedByMe = !draft[cords.x][cords.y].reservedByMe;
  });

  return updatedSeats
};

export const getUpdatedReservation = (choosenSeat, reservation, seatsToReserve) => {
  let updatedReservation = [];

  if (choosenSeat.reservedByMe) {
    updatedReservation = reservation.filter((s) => s.id !== choosenSeat.id);
  } else if (reservation.length < seatsToReserve) {
    updatedReservation.push(...reservation, choosenSeat);
  } else {
    return;
  }

  return updatedReservation;
};

export const convertSeatsToReserved = (seats) => {
  return produce(seats, (draft) => {
    draft.forEach((row) => {
      row.forEach((seat) => {
        if (seat?.reservedByMe) {
          seat.reservedByMe = false;
        }
      });
    });
  });
};