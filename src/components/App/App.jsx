import { Home, Reservation } from "components";
import { Redirect, Route, Switch } from "react-router-dom";

export const App = () => {
  return (
    <div className="App">
      <Switch>
        <Home exact path="/" />
        <Route
          path="/reservation/:seatsAmount/:nextToEachOther"
          component={Reservation}
        />
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    </div>
  );
};

export default App;
