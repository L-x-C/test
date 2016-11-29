import React from 'react';
import {Route} from 'react-router';

import App from './containers/App';
import TestPage from './containers/job/TestPage';

import * as JobEnter from './routeHelpers/jobEnter';
import storesClient from './stores';

export default function getRoutes(storesServer) {
  let stores = storesServer || storesClient;
  return (
    <Route component={App}>
      <Route path="test" component={TestPage} onEnter={JobEnter.enterJobList(stores)}/>
    </Route>
  );
}
