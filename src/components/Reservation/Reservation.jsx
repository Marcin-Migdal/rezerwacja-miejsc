import { useState } from "react";
import { Button } from "semantic-ui-react";
import { batch, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useSetReservation } from "hooks/useSetReservation";
import { editSeats, seatsSelector, updateSeats } from "slices/seatsSlice";
import { getUpdatedSeats, convertToReserved, getSeatsReserved } from "helper";
import { completeReservation } from "slices/reservationSlice";
import { useSelector } from "react-redux";
import { Seat } from "components";
import { links } from "utils";
import "./Reservation.css";

export const Reservation = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { seatsToReserve, nextToEachOther } = useParams();
  const { seats, seatsAvailable } = useSelector(seatsSelector);
  const hasReservedSeats = useSetReservation(seatsToReserve, nextToEachOther);

  const [notyfication, setNotyfication] = useState("");
  const [reservedSeats, setReservedSeats] = useState(
    nextToEachOther === "true" ? parseInt(seatsToReserve) : 0
  );

  const handleSeatReservation = (choosenSeat) => {
    if (choosenSeat.reservedByMe) {
      notyfication && setNotyfication("");
      setReservedSeats(reservedSeats - 1);
      dispatch(editSeats(getUpdatedSeats(seats, choosenSeat)));
    } else if (reservedSeats < seatsToReserve) {
      setReservedSeats(reservedSeats + 1);
      dispatch(editSeats(getUpdatedSeats(seats, choosenSeat)));
    } else {
      setNotyfication(
        "Nie możesz zarezerwować więcej miejsc.\n " +
          "Usuń któreś z wybranych miejsc."
      );
    }
  };

  const handleConfirmation = () => {
    batch(() => {
      dispatch(completeReservation(getSeatsReserved(seats)));
      dispatch(
        updateSeats({
          updatedSeats: convertToReserved(seats),
          updatedSeatsAvailable: seatsAvailable - seatsToReserve,
        })
      );
    });

    history.replace(links.summary);
  };

  return (
    <div className="reservation-container">
      {hasReservedSeats && (
        <>
          <span className="notyfication">{notyfication}</span>
          <div className="seats-container">
            {seats.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="seats-row">
                  {row.map((seat, seatIndex) => {
                    return (
                      <Seat
                        key={(rowIndex, seatIndex)}
                        seat={seat}
                        onClick={() => handleSeatReservation(seat)}
                      />
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
              disabled={reservedSeats !== parseInt(seatsToReserve)}
              className="reservation-button"
              content="Rezerwuj"
            />
          </div>
        </>
      )}
    </div>
  );
};
