const path = require("path");

module.exports = {
  mode: "production",
  entry: "./dist/umdRoot.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "umd.js",
    library: "fsRemote",
    libraryTarget: "umd"
  }
};
