import React, { PropTypes } from 'react';

export default function Page(props) {
    const {
        title
    } = props.params;

    return (
        <div>
            <h1>Page with title "{title}"</h1>
            <p>
                Inspect the {'<head>'} of this page. It will contain
            </p>
            <p>
                {`<title>${title}</title>`}.
            </p>
            <p>
                Both, when rendered on the server and on the client.
            </p>
        </div>
    );
}

Page.propTypes = {
    params: PropTypes.object.isRequired
};
