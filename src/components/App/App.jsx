import { Home, Reservation } from "components";
import { Route, Switch } from "react-router-dom";

export const App = () => {
  return (
    <div className="App">
      <Switch>
        <Home exact path="/" />
        <Route
          path="/reservation/:seats/:nextToEachOther"
          component={Reservation}
        />
      </Switch>
    </div>
  );
};

export default App;
