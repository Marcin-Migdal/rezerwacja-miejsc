import { useSelector } from "react-redux";
import { reservationSelector } from "slices/reservationSlice";
import { seatsSelector } from "slices/seatsSlice";

export const useCustomSelector = () => {
  const { seats, seatsAvailable } = useSelector(seatsSelector);
  const { reservation } = useSelector(reservationSelector);

  return { seats, seatsAvailable, reservation };
}
