import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Landing extends Component {
    constructor(...args) {
        super(...args);

        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const {
            value: title
        } = event.target;

        this.setState({
            title
        });
    }

    render() {
        const {
            title = ''
        } = this.state;

        const {
            host,
            protocol
        } = this.context;

        return (
            <div>
                <h1>Choose a title for your page!</h1>
                <p>
                    <input
                        value={title}
                        onChange={this.handleChange}
                    />
                </p>
                Now, go to&nbsp;
                <Link to={`/page/${title}`}>
                    {protocol}://{host}/page/{title}
                </Link>
                &nbsp;and inspect the {'<title>'} tag 😊
            </div>
        );
    }
}

Landing.contextTypes = {
    protocol: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired
};
