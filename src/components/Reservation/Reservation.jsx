import { useEffect, useState } from "react";
import { Button, Loader } from "semantic-ui-react";
import { useParams } from "react-router";
import { getSeats } from "api";

export const Reservation = () => {
  const { seatsAmount, nextToEachOther } = useParams();
  const [seats, setSeats] = useState();

  useEffect(() => {
    const addEmptyBox = (seatsInRow, length) => {
      for (let i = 1; i < length; i++) {
        seatsInRow.push({ isEmptySpace: true });
      }
    };

    const convertToTwoDimensonal = (seats) => {
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
          addEmptyBox(seatsInRow, cords.y + 1);
        }

        if (cords.x === prevCords?.x && cords.y - 1 !== prevCords.y) {
          addEmptyBox(seatsInRow, cords.y - prevCords.y);
        }

        seatsInRow.push({ ...seat, reservedByMe: false });
      });

      setSeats(twoDimensonal);
    };

    getSeats().then((res) => convertToTwoDimensonal(res));
  }, []);

  const handleReservation = (choosenSeat) => {
    if (choosenSeat.reserved && !choosenSeat.reservedByMe) {
      return;
    }
    let tempSeats = [...seats];

    tempSeats.forEach((row) => {
      row.forEach((seat) => {
        if (seat.id === choosenSeat.id) {
          seat.reserved = !seat.reserved;
          seat.reservedByMe = !seat.reservedByMe;
        }
      });
    });

    setSeats(tempSeats);
  };

  return (
    <div className="reservation-container">
      {seats ? (
        <>
          <div className="seats-container">
            {seats.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="seats-row">
                  {row.map((seat, seatIndex) => {
                    return (
                      <div
                        className="seat-container"
                        key={(rowIndex, seatIndex)}
                      >
                        {seat?.isEmptySpace ? (
                          <div className="empty-block" />
                        ) : (
                          <div
                            onClick={() => handleReservation(seat)}
                            className={
                              seat.reservedByMe
                                ? "seat-content reserved"
                                : seat.reserved
                                ? "seat-content unavailable"
                                : "seat-content"
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="bottom-container">
            <div className="seat-description">
              <div className="seat-content" />
              <p>Miejsca dostępne</p>
            </div>
            <div className="seat-description">
              <div className="seat-content unavailable" />
              <p>Miejsca Zarezerwowane</p>
            </div>
            <div className="seat-description">
              <div className="seat-content reserved" />
              <p>Miejsca Zarezerwowane</p>
            </div>
            <Button disabled={true} className="reservation-button">
              Rezerwuj
            </Button>
          </div>
        </>
      ) : (
        <div className="loader-position">
          <Loader active size="huge" />
        </div>
      )}
    </div>
  );
};
