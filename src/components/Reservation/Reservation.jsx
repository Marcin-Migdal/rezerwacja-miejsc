import { useEffect, useState } from "react";
import { getUpdatedSeats } from "helper";
import { Button } from "semantic-ui-react";
import { fetchSeats, updateSeats } from "slices/seatsSlice";
import { batch, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { clearReservation, setReservation } from "slices/reservationSlice";
import { useCustomSelector } from "hooks/useCustomSelector";

export const Reservation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { seatsToReserve, nextToEachOther } = useParams();
  const { seats, seatsAvailable, reservation } = useCustomSelector();

  const [notyfication, setNotyfication] = useState("");

  useEffect(() => {
    reservation.length > 0 && dispatch(clearReservation());
    return () => {
      dispatch(fetchSeats());
    };
  }, []);

  const handleReservation = (choosenSeat) => {
    let updatedReservation = [];

    if (choosenSeat.reservedByMe) {
      updatedReservation = reservation.filter((s) => s.id !== choosenSeat.id);
      notyfication && setNotyfication("");
    } else if (reservation.length < seatsToReserve) {
      updatedReservation.push(...reservation, choosenSeat);
    } else {
      setNotyfication(
        "Nie możesz zarezerwować więcej miejsc.\n " +
          "Usuń któreś z wybranych miejsc."
      );
      return;
    }

    const updatedSeatsAvailable = choosenSeat.reservedByMe
      ? seatsAvailable + 1
      : seatsAvailable - 1;

    const updatedSeats = getUpdatedSeats(seats, choosenSeat);

    batch(() => {
      dispatch(updateSeats({ updatedSeats, updatedSeatsAvailable }));
      dispatch(setReservation(updatedReservation));
    });
  };

  const handleConfirmation = () => {
    history.replace("/reservationSummary");
  };

  return (
    <div className="reservation-container">
      <span className="notyfication">{notyfication}</span>
      <div className="seats-container">
        {seats.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="seats-row">
              {row.map((seat, seatIndex) => {
                return (
                  <div className="seat-container" key={(rowIndex, seatIndex)}>
                    {seat?.isEmptySpace ? (
                      <div className="empty-block" />
                    ) : (
                      <button
                        onClick={() => handleReservation(seat)}
                        disabled={seat.reserved && !seat.reservedByMe}
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
          <p>Twój wybór</p>
        </div>
        <Button
          onClick={handleConfirmation}
          disabled={reservation.length !== parseInt(seatsToReserve)}
          className="reservation-button"
        >
          Rezerwuj
        </Button>
      </div>
    </div>
  );
};
