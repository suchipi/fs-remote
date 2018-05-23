const createServer = require("run-on-server/server");

module.exports = function createFsServer() {
  return createServer({ requireFrom: __dirname });
};
