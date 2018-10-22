const createRosServer = require("run-on-server/server");
const idMappings = require("./idMappings");

module.exports = function createServer(options = { cors: true }) {
  return createRosServer({
    requireFrom: __dirname,
    idMappings,
    cors: options.cors
  });
};
