import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Router, RouterContext} from 'react-router';

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object,
    history: PropTypes.object,
    routes: PropTypes.node,
    type: PropTypes.string,
    renderProps: PropTypes.object
  }

  componentDidMount() {
    window.__INITIAL_STATE__ = null;
  }

  render() {
    const {store, history, routes, type, renderProps} = this.props;

    return (
      <Provider store={store}>
        {type === 'server'
          ? <RouterContext {...renderProps}/>
          : <Router history={history} routes={routes}/>
}
      </Provider>
    );
  }
}
