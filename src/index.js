import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import Root from './containers/Root';
import getRoutes from './routes';
import rootSaga from './sagas';
import configureStore from './store/configureStore';
import './styles/main.scss'; //Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.

// remove 300ms click delay
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const store = configureStore(window.__INITIAL_STATE__);
const history = syncHistoryWithStore(browserHistory, store);
store.runSaga(rootSaga);

render(<Root store={store} history={history} routes={getRoutes(store)}/>, document.getElementById('app'));
