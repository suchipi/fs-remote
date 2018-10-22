const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./client-entry.js",
  plugins: [new HtmlWebpackPlugin()]
};
