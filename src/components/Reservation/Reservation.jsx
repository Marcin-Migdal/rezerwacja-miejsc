import { useParams } from "react-router";

export const Reservation = () => {
  const { seats, nextToEachOther } = useParams();

  return (
    <div className="reservation-container">
      <p>Reservation Page</p>
      <p>Ilość miejsc do zarezerwowania: {seats}</p>
      <p>Miejsca koło siebie ? {nextToEachOther === "true" ? "Tak" : "Nie"}</p>
    </div>
  );
};
