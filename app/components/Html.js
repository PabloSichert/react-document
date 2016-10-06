import React, { PropTypes } from 'react';
import { oneLine } from 'common-tags';

export default function Html(props, context) {
    const {
        children,
        params: {
            title = 'React Document'
        }
    } = props;

    const {
        scriptUrl,
        protocol,
        host
    } = context;

    return (
        <html>
            <head>
                <meta charSet='utf-8' />
                <meta httpEquiv='x-ua-compatible' content='ie=edge' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <title>{title}</title>
                <script dangerouslySetInnerHTML={{ __html: oneLine`
                    window.scriptUrl = '${scriptUrl}';
                    window.protocol = '${protocol}';
                    window.host = '${host}';
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
    children: PropTypes.node,
    params: PropTypes.object.isRequired
};

Html.contextTypes = {
    scriptUrl: PropTypes.string.isRequired,
    protocol: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired
};
