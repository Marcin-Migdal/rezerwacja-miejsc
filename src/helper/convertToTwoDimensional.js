export const convertToTwoDimensonal = (seats) => {
  let twoDimensonal = [];
  let seatsInRow = [];

  seats.forEach((seat, index) => {
    const prevCords = seats[index - 1]?.cords;
    const { cords } = seat;

    if (cords.x > seats[index - 1]?.cords.x) {
      twoDimensonal.push(seatsInRow);
      seatsInRow = [];
    }

    if (cords.x !== seats[index - 1]?.cords.x && cords.y !== 0) {
      for (let i = 1; i < cords.y + 1; i++) {
        seatsInRow.push({ isEmptySpace: true });
      }
    }

    if (cords.x === prevCords?.x && cords.y - 1 !== prevCords.y) {
      for (let i = 1; i < cords.y - prevCords.y; i++) {
        seatsInRow.push({ isEmptySpace: true });
      }
    }

    seatsInRow.push({ ...seat, reservedByMe: false });

    if (seats[index + 1]?.cords.x === undefined) {
      twoDimensonal.push(seatsInRow);
      seatsInRow = [];
    }
  });

  return twoDimensonal;
}