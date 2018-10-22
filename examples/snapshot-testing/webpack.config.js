const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const babelPluginTransformDirnameFilename = require("babel-plugin-transform-dirname-filename");

module.exports = {
  entry: "./src/index.js",
  plugins: [new HtmlWebpackPlugin()],
  resolve: {
    alias: {
      fs: path.resolve(__dirname, "src", "fs-stub.js")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            plugins: [babelPluginTransformDirnameFilename]
          }
        }
      }
    ]
  }
};
