import { useSelector } from "react-redux";

export const useCustomSelector = () => {
  const { seats, seatsAvailable, state, reservation, isComplete } =
    useSelector((state) => ({
      seats: state.seats.seats,
      seatsAvailable: state.seats.seatsAvailable,
      state: state.seats.state,
      reservation: state.reservation.reservation,
      isComplete: state.reservation.isComplete,
    }));

  return { seats, seatsAvailable, state, reservation, isComplete };
}
