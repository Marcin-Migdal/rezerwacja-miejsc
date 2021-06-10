import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { getReservedSeats, links } from "helper";
import { setReservation } from "slices/reservationSlice";
import { batch, useDispatch, useSelector } from "react-redux";
import { editSeats, seatsSelector, setPrevSeats } from "slices/seatsSlice";

export const useSetReservation = (seatsToReserve, nextToEachOther) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [hasReservedSeats, setHasReservedSeats] = useState(false);
  const { seats, seatsAvailable, maxSeatsNextToEachOther } = useSelector(seatsSelector)

  useEffect(() => {
    if (!hasReservedSeats) {
      if (nextToEachOther === "false") {
        dispatch(setPrevSeats({ seats, seatsAvailable }));
      } else if (nextToEachOther === "true") {
        if (maxSeatsNextToEachOther < seatsToReserve) {
          history.replace(links.home);
        }
        const { updatedSeats, updatedReservations } = getReservedSeats(seats, seatsToReserve);
        batch(() => {
          dispatch(setPrevSeats({ seats, seatsAvailable }));
          dispatch(editSeats(updatedSeats));
          dispatch(setReservation(updatedReservations));
        });
      } else {
        history.replace(links.home);
      }
      setHasReservedSeats(true)
    }
  }, [
    dispatch,
    history,
    seats,
    seatsAvailable,
    maxSeatsNextToEachOther,
    seatsToReserve,
    nextToEachOther,
    hasReservedSeats
  ]);

  return hasReservedSeats;
}
