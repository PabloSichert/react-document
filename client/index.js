import React from 'react';
import { render } from 'react-dom';
import Html from '../app/components/Html';

render((
    <Html
        scriptUrl={window.scriptUrl}
    />
), document);
