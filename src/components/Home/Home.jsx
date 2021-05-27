import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Checkbox, Input } from "semantic-ui-react";

export const Home = () => {
  let inputRef = useRef();
  const history = useHistory();
  const [inputValue, setInputValue] = useState(1);
  const [nextToEachOther, setNextToEachOther] = useState(false);

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value >= 1) {
      setInputValue(value);
    }
  };

  const handleCheckBoxChange = () => {
    setNextToEachOther(!nextToEachOther);
  };

  const goToReservationPage = () => {
    history.push("reservation/" + inputValue + "/" + nextToEachOther);
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
          value={inputValue}
          onChange={handleInputChange}
        />
      </label>
      <Checkbox
        label="Czy miejsca mają być koło siebie ?"
        className="checkbox"
        checked={nextToEachOther}
        onChange={handleCheckBoxChange}
      />
      <Button
        disabled={!inputValue || inputValue === 0}
        onClick={goToReservationPage}
      >
        Wybierz miejsca
      </Button>
    </div>
  );
};
