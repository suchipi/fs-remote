const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/client/client-test.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                "run-on-server",
                {
                  evalRequire: {
                    enabled: true
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};
