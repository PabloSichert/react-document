import React, { Component, PropTypes } from 'react';
import { oneLine } from 'common-tags';

export default class Html extends Component {
    constructor(...args) {
        super(...args);

        this.state = {};
    }

    componentDidMount() {
        this.setState({
            mounted: true
        });
    }

    render() {
        const {
            children,
            params: {
                title = 'React Document'
            }
        } = this.props;

        const {
            scriptUrl,
            protocol,
            host
        } = this.context;

        const {
            mounted
        } = this.state;

        return (
            <html>
                <head>
                    <meta charSet='utf-8' />
                    <meta httpEquiv='x-ua-compatible' content='ie=edge' />
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                    <title>{title}</title>
                    {!mounted &&
                        <script dangerouslySetInnerHTML={{ __html: oneLine`
                            window.scriptUrl = '${scriptUrl}';
                            window.protocol = '${protocol}';
                            window.host = '${host}';
                        `}} />
                    }
                    {!mounted &&
                        <script defer src={scriptUrl} />
                    }
                </head>
                <body>
                    {children}
                </body>
            </html>
        );
    }
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
