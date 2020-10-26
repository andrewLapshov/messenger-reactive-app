const path = require("path");
// const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

module.exports = {
  entry: "./js/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "static/js/[name]-[hash].bundle.js",
    publicPath: "/",
  },
  mode: isDev ? "development" : "production",
  devtool: "eval-cheap-module-source-map",
  stats: {
    /* Remove webpack child logs */
    children: false,
  },
  watch: isDev,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
  devServer: {
    port: 5000,
    clientLogLevel: "error",
    historyApiFallback: true,
    compress: true,
    hot: isDev,
    open: true,
    overlay: {
      errors: true,
    },
    progress: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
};
