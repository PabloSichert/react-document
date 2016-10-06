import { Component, PropTypes } from 'react';

export default class App extends Component {
    getChildContext() {
        const {
            scriptUrl,
            protocol,
            host
        } = this.props;

        return {
            scriptUrl,
            protocol,
            host
        };
    }

    render() {
        return this.props.children;
    }
}

App.childContextTypes = {
    scriptUrl: PropTypes.string.isRequired,
    protocol: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired
};

App.propTypes = {
    scriptUrl: PropTypes.string.isRequired,
    protocol: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
