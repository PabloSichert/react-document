import React, { PropTypes } from 'react';
import { oneLine } from 'common-tags';

export default function Html(props, context) {
    const {
        children
    } = props;

    const {
        scriptUrl
    } = context;

    return (
        <html>
            <head>
                <meta charSet='utf-8' />
                <meta httpEquiv='x-ua-compatible' content='ie=edge' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <script dangerouslySetInnerHTML={{ __html: oneLine`
                    window.scriptUrl = '${scriptUrl}';
                `}} />
                <script defer src={scriptUrl} />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}

Html.propTypes = {
    children: PropTypes.node
};

Html.contextTypes = {
    scriptUrl: PropTypes.string.isRequired
};
