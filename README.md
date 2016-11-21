m
==

**aka m.qiaobutang.com**

本项目是基于[react-slingshot](https://github.com/coryhouse/react-slingshot)搭建的。根据实际需要进行修改

项目的详细说明见[`docs/README.md`](docs/README.md)

目前该项目不包括服务端渲染，随后再加上。

## 快速开始进行开发

1. 保证你的电脑已经安装了[这些](docs/README.md#initial-machine-setup)
2. `npm install`
3. `npm start -s` `-s`是可选参数，会略去一些不重要的信息

## 部署

1. 生产环境打包执行命令`npm build`
2. 打开浏览器`npm run open:dist`

## 约定的规范

*  用`eslint`来规范代码风格，配置文件是.eslintrc，我们可以根据需要定制出我们自己的代码规范。
*  用[工具](https://github.com/nvie/gitflow)来遵守git-flow的规范
*  businessLogic目录主要负责一些业务逻辑，测试以spec.js结尾

## 服务端渲染

测试开始不启用服务端渲染，生产环境会使用服务端渲染。

## 生产环境依赖

1. npm
2. pm2

## 注意

下面这两项数据都是写死在程序里的，放在`src/constants`下

1. http://cv.qiaobutang.com/career/skills/category.json
2. http://cv.qiaobutang.com/career/issues/category.json
