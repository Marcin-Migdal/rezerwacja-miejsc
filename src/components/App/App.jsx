import { useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { Home, Reservation, Summary } from "components";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { fetchSeats, seatsSelector } from "slices/seatsSlice";

export const App = () => {
  const dispatch = useDispatch();
  const { state } = useSelector(seatsSelector);

  useEffect(() => {
    dispatch(fetchSeats());
  }, [dispatch]);

  return (
    <div className="App">
      {state === "loaded" ? (
        <Switch>
          <Home exact path="/" />
          <Route
            path="/reservation/:seatsToReserve/:nextToEachOther"
            component={Reservation}
          />
          <Route path="/summary" component={Summary} />
          <Route render={() => <Redirect to={{ pathname: "/" }} />} />
        </Switch>
      ) : state === "error" ? (
        <div className="error">Wystąpił bład</div>
      ) : (
        <div className="loader-position">
          <Loader active size="huge" />
        </div>
      )}
    </div>
  );
};

export default App;
