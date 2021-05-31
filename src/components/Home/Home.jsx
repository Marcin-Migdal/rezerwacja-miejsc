import { Button, Checkbox, Input } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import { seatsSelector } from "slices/seatsSlice";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Home.css";

export const Home = () => {
  const inputRef = useRef();
  const history = useHistory();
  const { seatsAvailable, maxSeatsNextToEachOther } =
    useSelector(seatsSelector);

  const [nextToEachOther, setNextToEachOther] = useState(false);
  const [seatsToReserve, setSeatsToReserve] = useState(1);
  const [notyfication, setNotyfication] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const maxInputValue = nextToEachOther
      ? maxSeatsNextToEachOther
      : seatsAvailable;

    if (value >= 0 && value <= maxInputValue) {
      notyfication && setNotyfication("");
      setSeatsToReserve(value);
    } else if (value < 0) {
      setNotyfication("Ilość miejsc nie może być ujemna");
      setSeatsToReserve(0);
    } else {
      setNotyfication("Maksymalna ilość dostępnych miejsc: " + maxInputValue);
      setSeatsToReserve(maxInputValue);
    }
  };

  const handleCheckBoxClick = () => {
    if (maxSeatsNextToEachOther < seatsToReserve && !nextToEachOther) {
      setSeatsToReserve(maxSeatsNextToEachOther);
      setNotyfication(
        "Maksymalna ilość dostępnych miejsc: " + maxSeatsNextToEachOther
      );
    }
    setNextToEachOther(!nextToEachOther);
  };

  const goToReservationPage = () => {
    history.push("/reservation/" + seatsToReserve + "/" + nextToEachOther);
  };

  return (
    <div className="home-container">
      <p className="notyfication">{notyfication}</p>
      <label className="label-text">
        Liczba miejsc:
        <Input
          type="number"
          ref={inputRef}
          value={seatsToReserve}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && goToReservationPage()}
        />
      </label>
      <Checkbox
        className="checkbox"
        checked={nextToEachOther}
        onChange={handleCheckBoxClick}
        label="Czy miejsca mają być koło siebie ?"
      />
      <Button
        disabled={!seatsToReserve || parseInt(seatsToReserve) === 0}
        onClick={goToReservationPage}
        content="Wybierz miejsca"
      />
    </div>
  );
};
