import { useSelector } from "react-redux";

export const useCustomSelector = () => {
  const { seats, seatsAvailable, reservation } =
    useSelector((state) => ({
      seats: state.seats.seats,
      seatsAvailable: state.seats.seatsAvailable,
      reservation: state.reservation.reservation,
    }));

  return { seats, seatsAvailable, reservation };
}
