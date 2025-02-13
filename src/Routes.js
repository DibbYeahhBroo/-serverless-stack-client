import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import ForgetPassword from "./containers/ForgetPassword";
import EmailUpdate from "./containers/EmailUpdate";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <UnauthenticatedRoute exact path="/login">
                <Login />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute exact path="/signup">
                <Signup />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path="/notes/new">
                <NewNote />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/notes/:id">
                <Notes />
            </AuthenticatedRoute>
            <UnauthenticatedRoute exact path="/forget">
                <ForgetPassword />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path="/emailchange">
                <EmailUpdate />
            </AuthenticatedRoute>
            {/* Finally, catch all unmatched routes */}
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}