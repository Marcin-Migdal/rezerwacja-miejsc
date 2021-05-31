export const getMaxSeatsNextToEachOther = (seats) => {
  let maxSeats = 0;

  seats.forEach(row => {
    let tempMaxSeats = 0;
    row.forEach((seat, seatIndex) => {
      if (!seat.reserved && !seat.isEmptySpace) {
        tempMaxSeats++
        if (row[seatIndex + 1] === undefined && maxSeats < tempMaxSeats) {
          maxSeats = tempMaxSeats;
        }
      } else {
        if (maxSeats < tempMaxSeats) {
          maxSeats = tempMaxSeats;
          tempMaxSeats = 0;
        } else {
          tempMaxSeats !== 0 && (tempMaxSeats = 0);
        }
      }
    });
  });
  return maxSeats;
}