import { Home, Reservation } from "components";
import { Route, Switch } from "react-router-dom";

export const App = () => {
  return (
    <div className="App">
      <Switch>
        <Home exact path="/" />
        <Route path="/reservation" component={Reservation} />
      </Switch>
    </div>
  );
};

export default App;
