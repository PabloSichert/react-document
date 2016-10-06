import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import Html from './components/Html';
import Landing from './components/Landing';
import Page from './components/Page';
import NotFound from './components/NotFound';

export default (
    <Router>
        <Route path='/' component={Html}>
            <IndexRoute component={Landing}/>
            <Route path='page/:title' component={Page} />
            <Route path='*' component={NotFound} />
        </Route>
    </Router>
);
