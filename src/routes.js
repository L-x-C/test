import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App';
import Career from './containers/career/View.jsx';
import NotFoundPage from './components/notFountPage/NotFoundPage.js';
import InfoPage from './containers/job/InfoPage.js';
import CompanyPage from './containers/job/CompanyPage.js';
import ListPage from './containers/job/ListPage.js';
import SearchPage from './containers/job/SearchPage.js';
import FavoritePage from './containers/job/FavoritePage.js';
import DeliverPage from './containers/job/DeliverPage.js';

import * as JobEnter from './routesHelpers/jobEnter';
import * as CareerEnter from './routesHelpers/careerEnter';

export default function getRoutes(store) {
  return (
    <Route component={App}>
      <Route path="job/list" component={ListPage} onEnter={JobEnter.enterJobList(store)}>
        <Route path="c/:companyId" component={CompanyPage} onEnter={JobEnter.enterJobCompany(store)}/>
        <Route path=":jobId" component={InfoPage} onEnter={JobEnter.enterJobInfo(store)}/>
      </Route>
      <Route path="job/search" component={SearchPage} onEnter={JobEnter.enterJobSearch(store)}>
        <Route path="c/:companyId" component={CompanyPage} onEnter={JobEnter.enterJobCompany(store)}/>
        <Route path=":jobId" component={InfoPage} onEnter={JobEnter.enterJobInfo(store)}/>
      </Route>

      <Route path="job/favorite" component={FavoritePage} onEnter={JobEnter.enterJobFavorite(store)}/>
      <Route path="job/delivery" component={DeliverPage} onEnter={JobEnter.enterJobDeliver(store)}/>

      <Route path="job/:jobId" component={InfoPage} onEnter={JobEnter.enterJobInfo(store)}/>
      <Route path="job/c/:companyId" component={CompanyPage} onEnter={JobEnter.enterJobCompany(store)}/>

      <Route path="career">
        <IndexRoute component={Career} onEnter={CareerEnter.enterCareer(store)} />
        <Route path=":uid" component={Career} onEnter={CareerEnter.enterCareer(store)} />
      </Route>
      <Route path="404" component={NotFoundPage}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  );
}
