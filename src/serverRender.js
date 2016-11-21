import React from 'react';
import {renderToString} from 'react-dom/server';
import serialize from 'serialize-javascript';
import {Provider} from 'react-redux';
import {match, RouterContext, createMemoryHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import rootSaga from './sagas';
import getRoutes from './routes';
import ASSETS from '../dist/assets.json';
import {STATIC_PREFIX} from '../config.json';
import {RedirectException, appendParam} from './helpers/location';

function renderFullPage(renderedContent, initialState, inWechat) {
  return `<!doctype html>
  <html lang="">
    <head>
      <meta http-equiv="content-type" content="text/html;charset=utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0">
      <meta name="format-detection" content="telephone=no">
      <meta name="format-detection" content="email=no">
      <meta name="format-detection" content="address=no">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="yes">
      <meta name="x5-orientation" content="portrait">
      <title>乔布简历</title>
      <link rel="stylesheet" href="${STATIC_PREFIX}${ASSETS.main.css}"/>
    </head>
    <body>
      <div id="app">${renderedContent}</div>
      <script>
        window.__INITIAL_STATE__ = ${serialize(initialState)};
      </script>
      ${inWechat ? '<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>' : ''}
      <script type="text/javascript" charset="utf-8" src="${STATIC_PREFIX}${ASSETS.main.js}"></script>
    </body>
  </html>`;
}

module.exports = (req, res, next) => {
  const interceptRedirectException = (e) => {
    if (e instanceof RedirectException) {
      const {location, options} = e;
      const {status, back} = options || {};
      const url = back ? appendParam(location, {return: (typeof back === 'string') ? back : (req.protocol + '://' + req.get('host') + req.originalUrl)}) : location
      if (status) {
        res.redirect(status, url);
      }
      else {
        res.redirect(url);
      }
      return true;
    }
    return false;
  }
  const catchSaga = (e) => {
    if (!interceptRedirectException(e)) {
      res.status(500).send(e.message);
    }
  }

  try {

  const inWechat = new RegExp('MicroMessenger', 'i').test(req.headers['user-agent']);
  // // 需要传入initialState
  const store = configureStore({cookie: req.headers.cookie});
  const memoryHistory = createMemoryHistory(req.originalUrl);
  const history = syncHistoryWithStore(memoryHistory, store);
  const sagaTask = store.runSaga(rootSaga);

  match({
    history,
    routes: getRoutes(store),
    location: req.originalUrl
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      if (!interceptRedirectException(error)) {
        next(error);
      }
    } else if (redirectLocation) {
      return res.redirect(302, encodeURI(redirectLocation.pathname + redirectLocation.search));
    } else if (renderProps && renderProps.components) {
      const rootComp = <Root store={store} renderProps={renderProps} type="server"/>;

      sagaTask.done.then(() => {
        // match saga done
        // now components saga start
        const componentSagaTask = store.runSaga(rootSaga);
        componentSagaTask.done.then(() => {
          res.status(200).send(renderFullPage(renderToString(rootComp), store.getState(), inWechat));
        }).catch(catchSaga);
        renderToString(rootComp);
        store.close();
      }).catch(catchSaga);
      store.close();
    } else {
      res.status(404).send('Not found');
    }
  });

  } catch(e) {
    if (!interceptRedirectException(e)) {
      throw e;
    }
  }
};
