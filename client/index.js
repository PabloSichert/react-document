import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import App from '../app/components/App';
import routes from '../app/routes';

render((
    <App
        scriptUrl={window.scriptUrl}
        protocol={window.protocol}
        host={window.host}
    >
        <Router
            history={browserHistory}
            routes={routes}
        />
    </App>
), document);
