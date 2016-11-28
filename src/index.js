import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import Root from './containers/Root';
import getRoutes from './routes';
import './styles/main.scss';
import stores from './stores';
// remove 300ms click delay
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(<Root stores={stores} history={browserHistory} routes={getRoutes()}/>, document.getElementById('app'));