const createRosServer = require("run-on-server/server");
const idMappings = require("./idMappings");

module.exports = function createServer() {
  return createRosServer({ requireFrom: __dirname, idMappings });
};
