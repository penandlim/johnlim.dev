"use strict";

var path = require('path');

var HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: "html-loader"
      }]
    }]
  },
  plugins: [new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
  })]
};
//# sourceMappingURL=webpack.config.js.map