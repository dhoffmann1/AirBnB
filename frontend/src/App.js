import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots"
import SpotDetails from "./components/AllSpots/SpotDetails";
import CurrentUserSpots from "./components/AllSpots/CurrentUserSpots"
import CreateSpotForm from "./components/AllSpots/CreateSpotForm"
import EditSpotForm from "./components/AllSpots/EditSpotForm"
import Footer from "./components/Footer"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  // const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <div id="overall-app-wrapper">
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <AllSpots />
          </Route>
          <Route exact path="/spots/current">
            <CurrentUserSpots />
          </Route>
          <Route exact path="/spots/create">
            <CreateSpotForm />
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <EditSpotForm />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route>
            <div>404 Page Not Found</div>
          </Route>
        </Switch>
      )}
    </div>
    <div id="app-footer-wrapper">
      <Footer />
    </div>
    </>
  );
}

export default App;
