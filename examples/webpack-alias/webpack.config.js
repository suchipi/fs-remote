const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  plugins: [new HtmlWebpackPlugin()],
  resolve: {
    alias: {
      fs: path.resolve(__dirname, "src", "fs-stub.js")
    }
  }
};
