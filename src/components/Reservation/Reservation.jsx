import { Button } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { batch, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useSetReservation } from "hooks/useSetReservation";
import { useCustomSelector } from "hooks/useCustomSelector";
import { restoreSeats, editSeats, updateSeats } from "slices/seatsSlice";
import { Seat } from "components";
import "./Reservation.css";
import {
  getUpdatedSeats,
  getUpdatedReservation,
  getMaxSeatsNextToEachOther,
  convertSeatsToReserved,
} from "helper";
import {
  setReservation,
  clearReservation,
  completeReservation,
} from "slices/reservationSlice";

export const Reservation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { seatsToReserve, nextToEachOther } = useParams();
  const { seats, seatsAvailable, reservation } = useCustomSelector();
  const hasReservedSeats = useSetReservation(seatsToReserve, nextToEachOther);

  const [notyfication, setNotyfication] = useState("");

  useEffect(() => {
    return () => {
      if (
        history.location.pathname !== "/summary" &&
        reservation.length > 0 &&
        !history.location.pathname.startsWith("/reservation")
      ) {
        batch(() => {
          dispatch(restoreSeats());
          dispatch(clearReservation());
        });
      }
    };
  }, [history, reservation, dispatch]);

  const handleReservation = (choosenSeat) => {
    const updatedReservation = getUpdatedReservation(
      choosenSeat,
      reservation,
      seatsToReserve
    );

    if (updatedReservation) {
      notyfication && setNotyfication("");
      const updatedSeats = getUpdatedSeats(seats, choosenSeat);
      batch(() => {
        dispatch(editSeats(updatedSeats));
        dispatch(setReservation(updatedReservation));
      });
    } else {
      setNotyfication(
        "Nie możesz zarezerwować więcej miejsc.\n " +
          "Usuń któreś z wybranych miejsc."
      );
    }
  };

  const handleConfirmation = () => {
    const updatedSeats = convertSeatsToReserved(seats);
    const updatedSeatsAvailable = seatsAvailable - seatsToReserve;
    const maxSeatsNextToEachOther = getMaxSeatsNextToEachOther(seats);

    batch(() => {
      dispatch(completeReservation());
      dispatch(
        updateSeats({
          updatedSeats,
          updatedSeatsAvailable,
          maxSeatsNextToEachOther,
        })
      );
    });

    history.replace("/summary");
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
                        onClick={() => handleReservation(seat)}
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
              disabled={reservation.length !== parseInt(seatsToReserve)}
              className="reservation-button"
              content="Rezerwuj"
            />
          </div>
        </>
      )}
    </div>
  );
};
