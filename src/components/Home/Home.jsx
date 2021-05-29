import { useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input } from "semantic-ui-react";
import { useCustomSelector } from "hooks/useCustomSelector";

export const Home = () => {
  const inputRef = useRef();
  const history = useHistory();
  const { seatsAvailable } = useCustomSelector();

  const [nextToEachOther, setNextToEachOther] = useState(false);
  const [seatsToReserve, setSeatsToReserve] = useState();

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= seatsAvailable) {
      setSeatsToReserve(value);
    }
  };

  const goToReservationPage = () => {
    history.push("/reservation/" + seatsToReserve + "/" + nextToEachOther);
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      goToReservationPage();
    }
  };

  return (
    <div className="home-container">
      <label className="label-text">
        Liczba miejsc:
        <Input
          onKeyPress={handlePressEnter}
          type="number"
          ref={inputRef}
          value={seatsToReserve}
          onChange={handleInputChange}
        />
      </label>
      <Checkbox
        label="Czy miejsca mają być koło siebie ?"
        className="checkbox"
        checked={nextToEachOther}
        onChange={() => setNextToEachOther(!nextToEachOther)}
      />
      <Button
        disabled={!seatsToReserve || seatsToReserve == 0}
        onClick={goToReservationPage}
      >
        Wybierz miejsca
      </Button>
    </div>
  );
};
