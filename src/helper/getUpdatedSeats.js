import produce from "immer";

export const getUpdatedSeats = (seats, choosenSeat) => {
  return produce(seats, (draft) => {
    draft.forEach((row) => {
      row.forEach((seat) => {
        if (seat.id === choosenSeat.id) {
          seat.reserved = !seat.reserved;
          seat.reservedByMe = !seat.reservedByMe;
        }
      });
    });
  });
}
