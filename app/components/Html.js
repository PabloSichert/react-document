import React, { PropTypes } from 'react';
import { oneLine } from 'common-tags';

export default function Html(props) {
    const {
        scriptUrl
    } = props;

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
                Hello world!
            </body>
        </html>
    );
}

Html.propTypes = {
    scriptUrl: PropTypes.string.isRequired
};
