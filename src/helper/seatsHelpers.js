import produce from "immer";

export const getUpdatedSeats = (seats, choosenSeat) => {
  const { cords } = choosenSeat;

  const updatedSeats = produce(seats, (draft) => {
    draft[cords.x][cords.y].reserved = !draft[cords.x][cords.y].reserved;
    draft[cords.x][cords.y].reservedByMe = !draft[cords.x][cords.y].reservedByMe;
  });

  return updatedSeats
};

export const convertToReserved = (seats) => {
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

export const getSeatsReserved = (seats) => {
  let filteredSeats = []

  seats.forEach(rows =>
    filteredSeats.push(...rows.filter(seat => seat.reservedByMe))
  )

  return filteredSeats;
}

export const resetSeatsReservedByMe = (seats) => {
  return produce(seats, (draft) => {
    draft.forEach((row) => {
      row.forEach((seat) => {
        if (seat.reservedByMe) {
          seat.reservedByMe = false;
          seat.reserved = false;
        }
      });
    });
  });
};