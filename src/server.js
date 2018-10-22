const createServer = require("run-on-server/server");
const idMappings = require("./idMappings");

module.exports = function createFsServer() {
  return createServer({ requireFrom: __dirname, idMappings });
};
