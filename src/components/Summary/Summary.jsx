import { useEffect } from "react";
import { useHistory } from "react-router";
import { Button } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { clearReservation, reservationSelector } from "slices/reservationSlice";
import "./Summary.css";

export const Summary = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { reservation, isComplete } = useSelector(reservationSelector);

  useEffect(() => {
    !isComplete && history.replace("/");
    return () => {
      isComplete && dispatch(clearReservation());
    };
  }, [dispatch, history, isComplete]);

  return (
    <div className="summary-container">
      <h1>Twoja rezerwacja przebiegła pomyślnie!</h1>
      <h2>Wybrałeś miejsca:</h2>
      <ul className="summary-list">
        {reservation.map((seat, index) => {
          return (
            <li key={index}>
              - Rząd {seat.cords.x}, miejsce {seat.cords.y} ({seat.id})
            </li>
          );
        })}
      </ul>
      <h2>
        Dziękujemy! W razie problemów prosimy o kontakt z działem administracji.
      </h2>

      <Button onClick={() => history.replace("/")} content="Strona główna" />
    </div>
  );
};
