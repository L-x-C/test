import React from 'react';
import {renderToString} from 'react-dom/server';
import serialize from 'serialize-javascript';
import {match, RouterContext, createMemoryHistory} from 'react-router';
import Root from './containers/Root';
import getRoutes from './routes';
import ASSETS from '../dist/assets.json';
import {STATIC_PREFIX} from '../config.json';
import stores from './stores';
// import {createServerState} from './stores';

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
  const inWechat = new RegExp('MicroMessenger', 'i').test(req.headers['user-agent']);
  match({
    routes: getRoutes(stores),
    location: req.originalUrl
  }, (error, redirectLocation, renderProps) => {
    if (error) {
        next(error);
    } else if (redirectLocation) {
      return res.redirect(302, encodeURI(redirectLocation.pathname + redirectLocation.search));
    } else if (renderProps && renderProps.components) {
      const rootComp = <Root stores={stores} renderProps={renderProps} type="server"/>;
      res.status(200).send(renderFullPage(renderToString(rootComp), stores, inWechat));
    } else {
      res.status(404).send('Not found');
    }
  });
  // const state = createServerState()
  // match({
  //   routes: getRoutes(),
  //   location: req.originalUrl
  // }, (error, redirectLocation, renderProps) => {
  //   if (error) return res.status(500).send(error.message)
  //   if (redirectLocation) return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
  //   if (!renderProps) return res.status(404).send('404 Not found')
  //
  //   let statusCode = renderProps.routes[1].path !== '*' ? 200 : 404 // Check for "Not Found" page ( in this case we have path "*" ) and use code 404 if that's the case
  //
  //   return fetchData(renderProps, state, actions).then(() => {
  //     const rootComp = <Root stores={state} renderProps={renderProps} type="server"/>;
  //     res.status(200).send(renderFullPage(renderToString(rootComp), stores, inWechat));
  //   }).catch((err) => {
  //     res.status(400).send('400: An error has occured : ' + err)
  //   })
  // })
};
