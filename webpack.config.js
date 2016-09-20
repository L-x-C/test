var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        page1: "./src/entry.js",
        page2: "./src/entry2.js"
    },
    output: {
        path: path.join(__dirname, 'out'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel', query: {presets: ['es2015']}},
            {test: /\.(jpg|png)$/, loader: "url?limit=8192"},
            {test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap")}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new ExtractTextPlugin('[name].css')
    ]
};