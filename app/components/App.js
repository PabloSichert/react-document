import { Component, PropTypes } from 'react';

export default class App extends Component {
    getChildContext() {
        const {
            scriptUrl
        } = this.props;

        return {
            scriptUrl
        };
    }

    render() {
        return this.props.children;
    }
}

App.childContextTypes = {
    scriptUrl: PropTypes.string.isRequired
};

App.propTypes = {
    scriptUrl: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
