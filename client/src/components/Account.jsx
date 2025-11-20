import React from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./Profile";
import EditProfile from "./EditProfile";

const Account = () => {
    return (
        <Switch>
            <Route exact path="/account" component={Profile} />
            <Route exact path="/account/edit" component={EditProfile} />
        </Switch>
    );
};

export default Account;
