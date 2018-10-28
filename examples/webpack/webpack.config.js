const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/client.js",
  plugins: [new HtmlWebpackPlugin()]
};
