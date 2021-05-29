import { useCustomSelector } from "hooks/useCustomSelector";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Button } from "semantic-ui-react";
import { clearReservation } from "slices/reservationSlice";

export const Summary = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { reservation, isComplete } = useCustomSelector();

  useEffect(() => {
    !isComplete && history.replace("/");
    return () => {
      isComplete && dispatch(clearReservation());
    };
  }, [dispatch, history, isComplete]);

  const goToHomePage = () => {
    history.replace("/");
  };

  return (
    <div className="summary-container">
      <h1>Twoja rezerwacja przebiegła pomyślnie!</h1>
      <h2>Wybrałeś miejsca:</h2>
      <ul className="summary-list">
        {reservation.map((seat) => {
          return (
            <li>
              - Rząd {seat.cords.x}, miejsce {seat.cords.y} ({seat.id})
            </li>
          );
        })}
      </ul>
      <h2>
        Dziękujemy! W razie problemów prosimy o kontakt z działem administracji.
      </h2>

      <Button onClick={goToHomePage}>Strona główna</Button>
    </div>
  );
};
