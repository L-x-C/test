import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import Root from './containers/Root';
import getRoutes from './routes';
import './styles/main.scss';
import ViewStore from './stores/ViewStore';
// remove 300ms click delay
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const state = new ViewStore();

render(<Root state={state} history={browserHistory} routes={getRoutes()}/>, document.getElementById('app'));
