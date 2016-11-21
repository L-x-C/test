## 现状
1. 客户端渲染
2. html的生成是通过buildHtml脚本来完成的。用cheerio来控制脚本的加载。

## 如何改造
采用webpack server的形式，用html-loader把index.html引入，同时不影响开发。
服务端渲染在开发的时候并不需要。因为和客户端渲染的效果是一样的。

把几个模块分别编译为多个文件比如routes、createStore。其他的服务端都是用原生的。
能让这些模块引用即可！


## ISSUES

1. react的代码里用到了各种loaders，而node得程序是不能直接处理的，怎么办？
两种方式：
  1. 使用webpack(target: node)对node程序进行处理。这时就需要`webpack.client.config.js`以及`webpack.server.config.js`
  2. [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools)

2. webpack-dev-server和server-render如何配合？
