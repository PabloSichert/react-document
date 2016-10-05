import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import Html from './components/Html';
import Landing from './components/Landing';
import NotFound from './components/NotFound';

export default (
    <Router>
        <Route path='/' component={Html}>
            <IndexRoute component={Landing}/>
            <Route path='*' component={NotFound} />
        </Route>
    </Router>
);
