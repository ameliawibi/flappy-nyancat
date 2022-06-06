// webpack.common.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  devtool: false,
  entry: "./src/index.js",
  output: {
    filename: "main-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[hash][ext][query]",
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "assets/**/*"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],
  // loaders
  module: {
    rules: [
      {
        // this is regex, it tells webpack to look for files that end with .css
        test: /\.scss$/,
        // the sequence here matters! style-loader needs to come before css-loader
        // because webpack reads these things from right to left
        use: [
          "style-loader", // step 3: injects Javascript into the DOM
          "css-loader", // step 2: turns css into valid Javascript
          "sass-loader", // step 1: converts sass to css
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          // webpack will automatically reference a .babelrc file
          loader: "babel-loader",
        },
      },
    ],
  },
};
