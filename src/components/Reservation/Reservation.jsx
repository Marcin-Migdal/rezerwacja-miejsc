import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { setPrevSeats, updateSeats, restoreSeats } from "slices/seatsSlice";
import { batch, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  clearReservation,
  completeReservation,
  setReservation,
} from "slices/reservationSlice";
import { useCustomSelector } from "hooks/useCustomSelector";
import produce from "immer";

export const Reservation = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { seatsToReserve, nextToEachOther } = useParams();
  const { seats, seatsAvailable, reservation } = useCustomSelector();

  const [notyfication, setNotyfication] = useState("");

  useEffect(() => {
    dispatch(setPrevSeats());
  }, [dispatch]);

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

  const getUpdatedReservation = (choosenSeat) => {
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

    return updatedReservation;
  };

  const getUpdatedSeats = (choosenSeat) => {
    const updatedSeats = produce(seats, (draft) => {
      draft.forEach((row) => {
        row.forEach((seat) => {
          if (seat.id === choosenSeat.id) {
            seat.reserved = !seat.reserved;
            seat.reservedByMe = !seat.reservedByMe;
          }
        });
      });
    });

    const updatedSeatsAvailable = choosenSeat.reservedByMe
      ? seatsAvailable + 1
      : seatsAvailable - 1;

    return { updatedSeats, updatedSeatsAvailable };
  };

  const handleReservation = (choosenSeat) => {
    const updatedReservation = getUpdatedReservation(choosenSeat);

    if (!updatedReservation) {
      return;
    }

    const payload = getUpdatedSeats(choosenSeat);

    batch(() => {
      dispatch(updateSeats(payload));
      dispatch(setReservation(updatedReservation));
    });
  };

  const convertSeatsToReserved = () => {
    const updatedSeats = produce(seats, (draft) => {
      draft.forEach((row) => {
        row.forEach((seat) => {
          if (seat.reservedByMe) {
            seat.reservedByMe = false;
          }
        });
      });
    });

    return updatedSeats;
  };

  const handleConfirmation = () => {
    const updatedSeats = convertSeatsToReserved();
    batch(() => {
      dispatch(completeReservation());
      dispatch(updateSeats({ updatedSeats }));
    });

    history.replace("/summary");
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
