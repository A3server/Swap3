import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Settings } from "./routes/Settings";
import { Home } from "./routes/Home";
import './App.css';

export const App = () => {
    return (
        <Switch>
            <Route path="/about">
                <Settings/>
            </Route>
            <Route path="/">
                <Home/>
            </Route>
        </Switch>
    )
};
