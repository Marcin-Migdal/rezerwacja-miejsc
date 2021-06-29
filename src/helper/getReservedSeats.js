import produce from "immer";

export const getReservedSeats = (seats, seatsToReserve) => {
  let seatCords = { row: 0, seat: 0 };

  seats.some((row, rowIndex) => {
    let tempMaxSeats = 0;
    return row.some((seat, seatIndex) => {
      if (!seat.reserved && !seat.isEmptySpace) {
        tempMaxSeats++;
        if (tempMaxSeats >= seatsToReserve) {
          seatCords = {
            row: rowIndex,
            seat: seatIndex - seatsToReserve + 1,
          };
          return true;
        }
      } else {
        tempMaxSeats !== 0 && (tempMaxSeats = 0);
      }
      return false;
    });
  });

  const updatedSeats = produce(seats, (draft) => {
    for (let i = 0; i < seatsToReserve; i++) {
      draft[seatCords.row][seatCords.seat + i].reserved = true;
      draft[seatCords.row][seatCords.seat + i].reservedByMe = true;
    }
  });

  return updatedSeats;
}