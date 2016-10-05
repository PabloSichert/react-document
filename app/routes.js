import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import Html from './components/Html';
import Landing from './components/Landing';

export default (
    <Router>
        <Route path='/' component={Html}>
            <IndexRoute component={Landing}/>
        </Route>
    </Router>
);
