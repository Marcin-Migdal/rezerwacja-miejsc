import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSeats, seatsSelector } from "slices/seatsSlice";
import { getReservedSeats, resetSeatsReservedByMe } from "helper";
import { links } from "utils";

export const useSetReservation = (seatsToReserve, nextToEachOther) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [hasReservedSeats, setHasReservedSeats] = useState(false);
  const { seats, seatsAvailable, maxSeatsNextToEachOther } = useSelector(seatsSelector)

  const [maxSeatsAvailable] = useState(
    nextToEachOther === "true" ? maxSeatsNextToEachOther : seatsAvailable
  );

  useEffect(() => {
    if (!hasReservedSeats) {
      if (
        (nextToEachOther !== "false" && nextToEachOther !== "true") ||
        maxSeatsAvailable < seatsToReserve
      ) {
        history.replace(links.home);
      }
      if (nextToEachOther === "true") {
        dispatch(editSeats(getReservedSeats(seats, seatsToReserve)));
      }
      setHasReservedSeats(true)
    }

    return () => {
      if (
        history.location.pathname !== links.summary &&
        !history.location.pathname.startsWith(links.reservation)
      ) {
        dispatch(editSeats(resetSeatsReservedByMe(seats)));
      }
    };
  }, [
    dispatch,
    history,
    seats,
    maxSeatsAvailable,
    seatsToReserve,
    nextToEachOther,
    hasReservedSeats
  ]);

  return hasReservedSeats;
}
