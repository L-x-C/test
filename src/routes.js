import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App';
import TestPage from './containers/job/TestPage';

export default function getRoutes() {
  return (
    <Route component={App}>
      <Route path="test" component={TestPage} />
    </Route>
  );
}
