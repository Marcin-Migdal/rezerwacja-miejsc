import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Checkbox, Input } from "semantic-ui-react";

export const Home = () => {
  let inputRef = useRef();
  const [inputValue, setInputValue] = useState(0);
  const [nextToEachOther, setNextToEachOther] = useState(false);

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleInputChange = (value) => {
    if (value >= 0) {
      setInputValue(value);
    }
  };
  const handleCheckBoxChange = () => {
    setNextToEachOther(!nextToEachOther);
  };

  return (
    <div className="home-container">
      <label className="label-text">
        Liczba miejsc:
        <Input
          type="number"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </label>
      <Checkbox
        label="Czy miejsca mają być koło siebie ?"
        className="checkbox"
        checked={nextToEachOther}
        onChange={handleCheckBoxChange}
      />
      <Button
        as={Link}
        to={{ pathname: "reservation/" + inputValue + "/" + nextToEachOther }}
      >
        Wybierz miejsca
      </Button>
    </div>
  );
};
