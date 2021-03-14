import { Route, Switch } from "react-router-dom";
import FourOhFour from './containers/404/FourOhFour';
import Home from "./containers/Home/Home";
import Item from "./containers/Item/Item";
import Profile from "./containers/Profile/Profile";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/definitelynotmerch/:id">
                <Item />
            </Route>
            <Route exact path="/profile">
                <Profile />
            </Route>
            {/* Finally, catch all unmatched routes */}
            <Route>
                <FourOhFour />
            </Route>
        </Switch>
    );
}