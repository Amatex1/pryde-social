import React from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./Profile/Profile";

const Account = () => {
    return (
        <Switch>
            <Route exact path="/account" component={Profile} />
        </Switch>
    );
};

export default Account;
